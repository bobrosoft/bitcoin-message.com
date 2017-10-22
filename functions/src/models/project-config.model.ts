import {config} from 'firebase-functions';
import Config = config.Config;

export interface ProjectConfig extends Config {
  blockchain: {
    network: ('bitcoin' | 'testnet');
    wallet_wif: string;
  }
}