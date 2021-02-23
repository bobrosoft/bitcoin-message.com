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
        this.basePath = 'https://rest.bitcoin.com/v2'; // Docs: https://github.com/bitpay/insight-api
        this.network = bitcoin.networks.bitcoin;
        break;

      case BlockchainNetwork.tbch:
        this.basePath = 'https://trest.bitcoin.com/v2';
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
      
        const unspents = unspentTransactions;
        const unspentsTotal = unspents.map(u => u.value_int).reduce((v, cv) => v + cv);
        const change = unspentsTotal - fee;
        console.info(`unspentsTotal: ${unspentsTotal} Satoshis`);
        console.info(`buildOpReturnTransaction: fee = ${fee} Satoshis`);
        console.info(`change: ${change} Satoshis`);
        
        if (change < 0) {
          throw new ApiError(`Not enough funds in unspent (required ${fee} Satoshis)`, ApiErrorCode.BLOCKCHAIN_NOT_ENOUGH_FUNDS);
        }
        
        // Create transaction
        const opReturnScript = bitcoin.script.nullData.output.encode(Buffer.from(message) as any);
        const tx = new bitcoin.TransactionBuilder(this.network);
        unspents.forEach(u => tx.addInput(u.txid, u.vout));
        tx.addOutput(opReturnScript, 0);
        tx.addOutput(this.wallet.getAddress(), change);
        (tx as any).enableBitcoinCash(true);
        tx.setVersion(2);

        // tslint:disable
        const hashType = bitcoin.Transaction.SIGHASH_ALL | (bitcoin.Transaction as any).SIGHASH_BITCOINCASHBIP143;
        // tslint:enable
        
        // Sign transaction with all inputs
        unspents.forEach((u, index) => {
          tx.sign(index, this.wallet, null, hashType, u.value_int);
        });

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
    return fetch(`${this.basePath}/rawtransactions/sendRawTransaction/${transaction}`, {
      method: 'GET',
      // headers: {'Content-Type': 'application/json'},
      // body: JSON.stringify({'rawtx': transaction})
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
      .then((data: string) => {
        console.log('pushTransaction response:', data);
        
        if (!data) {
          throw new ApiError(JSON.stringify(data), ApiErrorCode.HTTP_REQUEST_ERROR);
        }
      
        return {
          network: this.config.blockchain.network,
          txId: data
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
    return fetch(`${this.basePath}/address/utxo/${address}`)
      .then(r => r.json())
      .then((data: {utxos: any[]}) => {
        const vouts: number[] = [];
        
        return data.utxos
          .filter(t => {
            const isDuplicate = vouts.indexOf(t.vout) !== -1;
            vouts.push(t.vout);
            return !isDuplicate;
          })
          .map(t => {
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
