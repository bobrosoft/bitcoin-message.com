import * as imap from 'imap-simple';
import {ProjectConfig} from '../models/project-config.model';
import {Donation} from '../models/donation.model';
import {FetchOptions} from '@types/imap';

export class DonationsService {
  constructor(
    protected config: ProjectConfig
  ) {
  }

  /**
   * Returns recent donations
   * @returns {Promise<Donation[]>}
   */
  getRecentDonations(): Promise<Donation[]> {
    let connection: imap.ImapSimple;

    return imap
      .connect({
        imap: {
          user: this.config.donations.imap_user,
          password: this.config.donations.imap_password,
          host: this.config.donations.imap_host,
          port: this.config.donations.imap_port || 993,
          tls: this.config.donations.imap_use_tls || true,
          authTimeout: this.config.donations.imap_auth_time || 3000
        }
      })
      .then((c) => {
        connection = c;
        return connection.openBox(this.config.donations.imap_mailbox_name || 'INBOX');
      })
      .then(() => {
        // Let's find our donation messages
        const searchCriteria = [
          ['SINCE', (new Date(Date.now() - 7 * 86400 * 1000)).toISOString()],
          ['FROM', 'service@paypal.com'],
          ['HEADER', 'Authentication-Results', 'as permitted sender'], // Security: here we utilize mailserver's builtin sender check
          ['SUBJECT', 'Donation']
        ];

        const fetchOptions: FetchOptions = {
          bodies: ['HEADER', 'TEXT'],
          struct: true,
          markSeen: false
        };

        return connection.search(searchCriteria, fetchOptions);
      })
      .then((results) => {
        return results
          .map((res) => {
            return this.parseAndExtractDonations(new Buffer(res.parts.find(p => p.which === 'TEXT').body, 'base64').toString('utf8'));
          })
          .filter(v => !!v) // drop undefined
        ;
      })
    ;
  }

  /**
   * Returns donations from parsed body
   * @param {string} body
   * @returns {Donation}
   */
  parseAndExtractDonations(body: string): Donation | undefined {
    const matches = body.match(/donation of\s?(.*?)\s+(.*?)\s+from.*?>(.*?)(&nbsp;)*?\s+<.*?You can/);

    if (!matches) {
      return;
    }
    
    return {
      email: matches[3],
      amount: matches[1].replace(',', '.'),
      currency: matches[2]
    };
  }
}