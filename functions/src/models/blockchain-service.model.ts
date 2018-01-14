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
   * Returns recommended fee (in Satoshis) based on message length
   * @param {string} message
   * @returns {number}
   */
  getRecommendedFee(message: string): number {
    const baseTransactionSize = 200;
    return Math.max(
      Number(this.config.blockchain.fee_satoshis_per_byte) * (baseTransactionSize + Buffer.from(message).length),
      Number(this.config.blockchain.minimum_total_fee_satoshis)
    );
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
}