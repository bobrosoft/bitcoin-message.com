export interface UnspentTransaction {
  txid: string;
  value: string;
  value_int: number;
  vout: number;
  confirmations: number;
}