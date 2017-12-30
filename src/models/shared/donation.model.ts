export interface Donation {
  id: string;
  email: string;
  amount: string;
  currency: string;
  createdTimestamp: number;
  messageId?: string;
  errorCode?: string;
  errorMessage?: string;
}