import {BlockchainNetwork} from './blockchain-network.model';

export interface BlockchainTransaction {
  network: BlockchainNetwork;
  txId: string;
}