export interface UnspentTransaction {
  txid: string;
  value: string;
  value_int: number;
  n: number;
  confirmations: number;
}