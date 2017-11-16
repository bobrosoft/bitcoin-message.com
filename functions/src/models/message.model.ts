export interface Message {
  id?: string; // created during push
  message: string;
  email: string;
  createdTimestamp: number;
  blockchainTxId?: string;
}