import fetch from 'node-fetch';
import * as bitcoin from 'bitcoinjs-lib';
import {ECPair} from 'bitcoinjs-lib';
import {ProjectConfig} from '../models/project-config.model';
import {UnspentTransaction} from '../models/unspent-transaction.model';
import {ApiError} from '../models/api-error.model';
import {BlockchainNetwork} from '../models/blockchain-network.model';
import {BlockchainTransaction} from '../models/blockchain-transaction.model';

export class BlockchainService {
  protected basePath: string;
  protected network: bitcoin.Network;
  protected wallet: ECPair;
  protected baseTransactionSize: number = 200;
  
  constructor(
    protected config: ProjectConfig
  ) {
    // Choose network
    switch (config.blockchain.network) {
      case BlockchainNetwork.btc:
        this.basePath = 'https://api.smartbit.com.au/v1';
        this.network = bitcoin.networks.bitcoin;
        break;
        
      default:
        this.basePath = 'https://testnet-api.smartbit.com.au/v1';
        this.network = bitcoin.networks.testnet;
        break;
    }
    
    // Create wallet
    this.wallet = ECPair.fromWIF(config.blockchain.wallet_wif, this.network);
  }

  /**
   * Creates OP_RETURN transaction
   * @param {string} message
   * @param {number} fee
   * @returns {Promise<Transaction>}
   */
  buildOpReturnTransaction(message: string, fee: number = this.getRecommendedFee(message)): Promise<bitcoin.Transaction> {
    return this.getUnspentTransactions()
      .then((unspentTransactions) => {
        if (!unspentTransactions.length) {
          throw new ApiError('No unspent transactions found', 'BLOCKCHAIN_NO_UNSPENT_TRANSACTIONS');
        }
      
        const unspent = unspentTransactions[0];
        const change = unspent.value_int - fee;
        
        if (change < 0) {
          throw new ApiError(`Not enough funds in unspent (required ${fee} Satoshis)`, 'BLOCKCHAIN_NOT_ENOUGH_FUNDS');
        }
        
        const opReturnScript = bitcoin.script.nullData.output.encode(Buffer.from(message) as any);
        const tx = new bitcoin.TransactionBuilder(this.network);
        tx.addInput(unspent.txid, unspent.n);
        tx.addOutput(opReturnScript, 0);
        tx.addOutput(this.wallet.getAddress() as any, change);
        tx.sign(0, this.wallet);

        return tx.build();
      })
    ;
  }

  /**
   * Pushes transaction to the blockchain
   * @param {Transaction} transaction
   * @returns {Promise<BlockchainTransaction>}
   */
  pushTransaction(transaction: bitcoin.Transaction): Promise<BlockchainTransaction> {
    return fetch(`${this.basePath}/blockchain/pushtx`, {
      method: 'POST',
      body: JSON.stringify({hex: transaction.toHex()})
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
   * Returns recommended fee based on message length
   * @param {string} message
   * @returns {number}
   */
  getRecommendedFee(message: string): number {
    return Number(this.config.blockchain.fee_satoshis_per_byte) * (this.baseTransactionSize + Buffer.from(message).length);
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
        return data.unspent;
      });
  }
}
