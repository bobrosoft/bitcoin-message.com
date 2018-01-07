import {UnspentTransaction} from './unspent-transaction.model';
import {ProjectConfig} from './project-config.model';
import {RawTransaction} from './raw-transaction.model';
import {BlockchainTransaction} from './shared/blockchain-transaction.model';

export abstract class BlockchainService {

  constructor(
    protected config: ProjectConfig
  ) {
  }
  
  /**
   * Creates OP_RETURN transaction
   * @param {string} message
   * @param {number} fee (in Satoshis)
   * @returns {Promise<RawTransaction>}
   */
  abstract buildOpReturnTransaction(message: string, fee?: number): Promise<RawTransaction>;

  /**
   * Pushes transaction to the blockchain
   * @param {RawTransaction} transaction
   * @returns {Promise<BlockchainTransaction>}
   */
  abstract pushTransaction(transaction: RawTransaction): Promise<BlockchainTransaction>;

  /**
   * Returns unspent transactions
   * @returns {Promise<UnspentTransaction[]>}
   */
  abstract getUnspentTransactions(): Promise<UnspentTransaction[]>;

  /**
   * Returns recommended fee (in Satoshis) based on message length
   * @param {string} message
   * @returns {number}
   */
  abstract getRecommendedFee(message: string): number;
}