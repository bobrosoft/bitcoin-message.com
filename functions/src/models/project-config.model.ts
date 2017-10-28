import {config} from 'firebase-functions';
import Config = config.Config;

export interface ProjectConfig extends Config {
  blockchain: {
    network: ('bitcoin' | 'testnet');
    wallet_wif: string;
    fee_satoshis_per_byte: number; // usual transaction is between 200 and 300 bytes
  };
}