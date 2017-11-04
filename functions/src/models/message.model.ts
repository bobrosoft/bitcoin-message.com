export interface Message {
  id?: string; // created during push
  message: string;
  email: string;
  isPaid: boolean;
  isPublished: boolean;
  createdTimestamp: number;
  blockchainTxId?: string;
}