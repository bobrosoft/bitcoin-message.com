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

export class BitcoinBlockchainService extends BlockchainService {
  protected basePath: string;
  protected network: bitcoin.Network;
  protected wallet: ECPair;
  
  constructor(
    protected config: ProjectConfig
  ) {
    super(config);
    
    // Choose network
    switch (config.blockchain.network) {
      case BlockchainNetwork.btc:
        this.basePath = 'https://api.smartbit.com.au/v1'; // Docs: https://www.smartbit.com.au/api
        this.network = bitcoin.networks.bitcoin;
        break;

      case BlockchainNetwork.tbtc:
        this.basePath = 'https://testnet-api.smartbit.com.au/v1';
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
        tx.sign(0, this.wallet);

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
    return fetch(`${this.basePath}/blockchain/pushtx`, {
      method: 'POST',
      body: JSON.stringify({hex: transaction})
    })
      .then(r => r.json())
      .then((data: any) => {
        return {
          network: this.config.blockchain.network,
          txId: data.txid
        };
      });
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
    return fetch(`${this.basePath}/blockchain/address/${address}/unspent?limit=100`)
      .then(r => r.json())
      .then((data: any) => {
        return data.unspent.map(d => {
          return {
            ...d,
            vout: d.n
          } as UnspentTransaction;
        });
      });
  }
}
