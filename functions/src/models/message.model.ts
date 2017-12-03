export interface Message {
  id?: string; // created during push
  message: string;
  email?: string;
  isPublished: boolean;
  blockchainTxId?: string;
  createdTimestamp: number;
}