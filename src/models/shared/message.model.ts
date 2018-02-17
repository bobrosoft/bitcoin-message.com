import {BlockchainNetwork} from './blockchain-network.model';

export interface Message {
  id?: string; // created during push
  message: string;
  email?: string;
  isPublished: boolean;
  createdTimestamp: number;
  blockchainNetwork?: BlockchainNetwork;
  blockchainTxId?: string;
  clientIp?: string;
}