import {config} from 'firebase-functions';
import Config = config.Config;

// Firebase allow only underscores :'(
export interface ProjectConfig extends Config {
  blockchain: {
    network: ('bitcoin' | 'testnet');
    wallet_wif: string;
    fee_satoshis_per_byte: number; // usual transaction is between 200 and 300 bytes
  };
  
  donations: {
    imap_user: string; // usually your email
    imap_password: string;
    imap_host: string;
    imap_port?: number;
    imap_use_tls?: boolean;
    imap_auth_time?: number; // number of milliseconds to wait to be authenticated after
    imap_mailbox_name?: string; // mailbox to check. Default is 'INBOX'
  };
}