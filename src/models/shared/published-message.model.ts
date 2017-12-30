import {BlockchainNetwork} from './blockchain-network.model';

export interface PublishedMessage {
  message: string;
  blockchainNetwork: BlockchainNetwork;
  blockchainTxId: string;
  createdTimestamp: number;
}