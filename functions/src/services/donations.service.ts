import * as admin from 'firebase-admin';
import * as imap from 'imap-simple';
import {ProjectConfig} from '../models/project-config.model';
import {Donation} from '../models/shared/donation.model';
import {FetchOptions} from 'imap';
import {ApiError, ApiErrorCode} from '../models/api-error.model';
import {ExchangeRatesService} from './exchange-rates.service';
import {MessagesService} from './messages.service';

export class DonationsService {
  constructor(
    protected config: ProjectConfig,
    protected exchangeRatesService: ExchangeRatesService,
    protected messagesService: MessagesService,
    protected dbDonations: admin.database.Reference = admin.database().ref('processedDonations')
  ) {
  }

  /**
   * Returns recent donations
   * @returns {Promise<Donation[]>}
   */
  retrieveRecentDonations(): Promise<Donation[]> {
    let connection: imap.ImapSimple;

    return imap
      .connect({
        imap: {
          user: this.config.donations.imap_user,
          password: this.config.donations.imap_password,
          host: this.config.donations.imap_host,
          port: this.config.donations.imap_port ? Number(this.config.donations.imap_port) : 993,
          tls: this.config.donations.imap_use_tls ? this.config.donations.imap_use_tls === 'true' : true,
          authTimeout: this.config.donations.imap_auth_time ? Number(this.config.donations.imap_auth_time) : 3000
        }
      })
      .then((c) => {
        connection = c;
        return connection.openBox(this.config.donations.imap_mailbox_name || 'INBOX');
      })
      .then(() => {
        // Let's find our donation messages
        let searchCriteria = [
          ['SINCE', (new Date(Date.now() - 7 * 86400 * 1000)).toISOString()],
          ['SUBJECT', 'Donation'],
        ];
        
        // Add some security
        if (this.config.donations.disable_security_check !== 'true') {
          searchCriteria = [
            ...searchCriteria,
            ['FROM', 'service@paypal.com'],
            ['HEADER', 'Authentication-Results', 'as permitted sender'], // here we utilize mailserver's builtin sender check
          ];
        }

        const fetchOptions: FetchOptions = {
          bodies: ['HEADER', 'TEXT'],
          struct: true,
          markSeen: false
        };

        return connection.search(searchCriteria, fetchOptions);
      })
      .then((messages) => {
        return messages
          .map(this.parseAndExtractDonations)
          .filter(v => !!v) as Donation[] // drop undefined
        ;
      })
    ;
  }

  /**
   * Returns donation from DB (if exists)
   * @param {string} id
   * @returns {Promise<Donation>}
   */
  getStoredDonationById(id: string): Promise<Donation | null> {
    return this.dbDonations.child(id).once('value').then(s => s.val());
  }

  /**
   * Processes donation and sends message to blockchain
   * @param {Donation} donation
   * @returns {Promise<Donation>}
   */
  async processDonation(donation: Donation): Promise<Donation> {
    try {
      // Push donation using transaction (Firebase have kinda specific implementation for them)
      const transaction = await this.dbDonations.child(donation.id).transaction((currentData?: Donation) => {
        if (currentData) {
          // Donation already processed before or by other thread
          return; // abort transaction
        }

        return donation; // creating donation
      });

      // Exit, if transaction wasn't committed (i.e. if already processed)
      if (!transaction.committed) {
        return transaction.snapshot!.val();
      }

      /// Process donation
      console.info('Processing new donation', donation);
      
      // Check if donation has insufficient amount
      if (Number(this.exchangeRatesService.convert(donation.amount, donation.currency, this.config.donations.min_donation_currency)) < Number(this.config.donations.min_donation_amount)) {
        throw new ApiError(`Donation has insufficient amount. Minimal amount is ${this.config.donations.min_donation_amount} ${this.config.donations.min_donation_currency}`, ApiErrorCode.DONATION_INSUFFICIENT_AMOUNT);
      }

      // Find message
      const message = await this.messagesService.getLastUnpublishedMessageForEmail(donation.email);

      if (message) {
        // Save messageId in donation
        donation.messageId = message.id;
        await this.dbDonations.child(donation.id).set(donation);
        
        // Publish message
        console.info('Publishing message', message);
        await this.messagesService.publishMessageInBlockchain(message);
      } else {
        // Skipping, that was a donation without linked message
      }
    } catch (e) {
      const err = e as ApiError;
      console.error(err);

      switch (err.code) {
        case ApiErrorCode.BLOCKCHAIN_NO_UNSPENT_TRANSACTIONS:
        case ApiErrorCode.BLOCKCHAIN_NOT_ENOUGH_FUNDS:
          // Delete donation from processed so we can retry it
          await this.dbDonations.child(donation.id).remove();
          break;

        default:
          // Donation processing can't be retried
          // Save info about error so we don't need to process that donation again
          donation.errorCode = err.name;
          donation.errorMessage = err.message;
          await this.dbDonations.child(donation.id).set(donation);
      }
    }

    // Always return latest from DB
    return await this.dbDonations.child(donation.id).once('value').then(s => s.val());
  }

  /**
   * Returns donations from parsed body
   * @param message
   * @returns {Donation}
   */
  parseAndExtractDonations(message: imap.Message): Donation | undefined {
    const body = new Buffer(message.parts.find(p => p.which === 'TEXT')!.body, 'base64').toString('utf8');
    const matches = body.match(/donation of\s?(.*?)\s+(.*?)\s+from.*?>(.*?)(&nbsp;)*?\s+<.*?You can/);

    if (!matches) {
      return;
    }
    
    return {
      id: String(message.attributes.uid),
      email: matches[3],
      amount: matches[1].replace(',', '.'),
      currency: matches[2],
      createdTimestamp: Date.now()
    };
  }
}