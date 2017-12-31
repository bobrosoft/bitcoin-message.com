// import {config} from 'firebase-functions';
// import Config = config.Config;

// Firebase allows only underscores :'(
import {BlockchainNetwork} from './shared/blockchain-network.model';

export interface ProjectConfig {
  firebase: any;
  
  blockchain: {
    network: BlockchainNetwork;
    wallet_wif: string;
    fee_satoshis_per_byte: string; // usual transaction is between 200 and 300 bytes
  };
  
  donations: {
    imap_user: string; // usually your email
    imap_password: string;
    imap_host: string;
    imap_port?: number;
    imap_use_tls?: boolean;
    imap_auth_time?: number; // number of milliseconds to wait to be authenticated after
    imap_mailbox_name?: string; // mailbox to check. Default is 'INBOX'
    min_donation_amount: string;
    min_donation_currency: string;
    disable_security_check: 'true' | 'false'; // for testing
  };
}