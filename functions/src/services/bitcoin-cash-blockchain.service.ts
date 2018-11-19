import fetch from 'node-fetch';
import * as bitcoin from 'bitcoinjs-lib';
import {BlockchainService} from '../models/blockchain-service.model';
import {ECPair} from 'bitcoinjs-lib';
import {ProjectConfig} from '../models/project-config.model';
import {UnspentTransaction} from '../models/unspent-transaction.model';
import {ApiError, ApiErrorCode} from '../models/api-error.model';
import {BlockchainTransaction} from '../models/shared/blockchain-transaction.model';
import {BlockchainNetwork} from '../models/shared/blockchain-network.model';
import {RawTransaction} from '../models/raw-transaction.model';

export class BitcoinCashBlockchainService extends BlockchainService {
  protected basePath: string;
  protected network: bitcoin.Network;
  protected wallet: ECPair;
  
  constructor(
    protected config: ProjectConfig
  ) {
    super(config);
    
    // Choose network
    switch (config.blockchain.network) {
      case BlockchainNetwork.bch:
        this.basePath = 'https://blockdozer.com/insight-api'; // Docs: https://github.com/bitpay/insight-api
        this.network = bitcoin.networks.bitcoin;
        break;

      case BlockchainNetwork.tbch:
        this.basePath = 'https://tbch.blockdozer.com/insight-api';
        this.network = bitcoin.networks.testnet;
        break;
        
      default:
        throw new ApiError('Wrong blockchain network passed: ' + config.blockchain.network);
    }
    
    // Create wallet
    this.wallet = ECPair.fromWIF(config.blockchain.wallet_wif, this.network);
  }

  /**
   * Creates OP_RETURN transaction
   * @param {string} message
   * @param {number} fee (in Satoshis)
   * @returns {Promise<RawTransaction>}
   */
  buildOpReturnTransaction(message: string, fee: number = this.getRecommendedFee(message)): Promise<RawTransaction> {
    return this.getUnspentTransactions()
      .then((unspentTransactions) => {
        if (!unspentTransactions.length) {
          throw new ApiError('No unspent transactions found', ApiErrorCode.BLOCKCHAIN_NO_UNSPENT_TRANSACTIONS);
        }
      
        const unspent = unspentTransactions[0];
        const change = unspent.value_int - fee;
        console.info(`buildOpReturnTransaction: fee = ${fee} Satoshis`);
        
        if (change < 0) {
          throw new ApiError(`Not enough funds in unspent (required ${fee} Satoshis)`, ApiErrorCode.BLOCKCHAIN_NOT_ENOUGH_FUNDS);
        }
        
        const opReturnScript = bitcoin.script.nullData.output.encode(Buffer.from(message) as any);
        const tx = new bitcoin.TransactionBuilder(this.network);
        tx.addInput(unspent.txid, unspent.vout);
        tx.addOutput(opReturnScript, 0);
        tx.addOutput(this.wallet.getAddress(), change);
        (tx as any).enableBitcoinCash(true);
        tx.setVersion(2);

        // tslint:disable
        const hashType = bitcoin.Transaction.SIGHASH_ALL | (bitcoin.Transaction as any).SIGHASH_BITCOINCASHBIP143;
        // tslint:enable
        tx.sign(0, this.wallet, null, hashType, unspent.value_int);

        return tx.build().toHex();
      })
    ;
  }

  /**
   * Pushes transaction to the blockchain
   * @param {RawTransaction} transaction
   * @returns {Promise<BlockchainTransaction>}
   */
  pushTransaction(transaction: RawTransaction): Promise<BlockchainTransaction> {
    return fetch(`${this.basePath}/tx/send`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'rawtx': transaction})
    })
      .then(r => {
        return r.text().then(text => ({code: r.status, body: text}));
      })
      .then(r => {
        try {
          if (r.code < 200 || r.code > 299) {
            throw new Error(r.body);
          }
          
          return JSON.parse(r.body);
        } catch (e) {
          throw new Error(r.body);
        }
      })
      .catch((e: Error) => {
        throw new ApiError(e.message, ApiErrorCode.HTTP_REQUEST_ERROR);
      })
      .then((data: any) => {
        console.log('pushTransaction response:', data);
        
        if (!data.txid) {
          throw new ApiError(JSON.stringify(data), ApiErrorCode.HTTP_REQUEST_ERROR);
        }
      
        return {
          network: this.config.blockchain.network,
          txId: data.txid
        };
      })
    ;
  }

  /**
   * Returns unspent transactions
   * @returns {Promise<UnspentTransaction[]>}
   */
  getUnspentTransactions(): Promise<UnspentTransaction[]> {
    return this.getUnspentTransactionsForAddress(this.wallet.getAddress());
  }

  /**
   * Returns unspent transactions for passed address
   * @param {string} address
   * @returns {Promise<UnspentTransaction[]>}
   */
  protected getUnspentTransactionsForAddress(address: string): Promise<UnspentTransaction[]> {
    return fetch(`${this.basePath}/addr/${address}/utxo`)
      .then(r => r.json())
      .then((data: any[]) => {
        return data.map(t => {
          return {
            txid: t.txid,
            vout: t.vout,
            value: String(t.amount),
            value_int: t.satoshis,
            confirmations: t.confirmations
          } as UnspentTransaction;
        });
      });
  }
}
