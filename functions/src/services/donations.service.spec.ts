import 'jasmine';
import * as imap from 'imap-simple';
import {DonationsService} from './donations.service';

describe('DonationsService', () => {
  let service: DonationsService;
  
  beforeEach(() => {
    service = new DonationsService({} as any, {} as any, {} as any, {} as any);
  });
  
  it('should init', () => {
    expect(service).toBeDefined();
  });
  
  it('should extract donations', () => {
    const body = `<span   style="display:inline;">This email confirms that you have received a donation of60,00 RUB from BOBR A (<a href="mailto:test@gmail.com?ppid=PPX000646&cnac=RU&rsta=en_RU(en_RU)&cust=XFVEHW7MBPHJ8&unptid=c4d44bd6-f85d-11e7-8f89-441ea14dee48&t=&cal=62b91d8699963&calc=62b91d8699963&calf=62b91d8699963&unp_tpcid=email-xclick-donation-notification&page=main:email&pgrp=main:email&e=op&mchn=em&s=ci&mail=sys" style="text-decoration:none;" target="_BLANK">test@gmail.com </a>). You can <a href="https://www.paypal.com/myaccount/transaction/details/2BX002687V679263P?ppid=PPX000646&cnac=RU&rsta=en_RU(en_RU)&cust=XFVEHW7MBPHJ8&unptid=c4d44bd6-f85d-11e7-8f89-441ea14dee48&t=&cal=62b91d8699963&calc=62b91d8699963&calf=62b91d8699963&unp_tpcid=email-xclick-donation-notification&page=main:email&pgrp=main:email&e=op&mchn=em&s=ci&mail=sys" style="text-decoration:none;" target="_BLANK">view the transaction details online </a>`;
    const bodyBase64 = new Buffer(body).toString('base64');
    const subject = 'You Have a Pending Donation';
    const message: imap.Message = {
      seqno: 1,
      attributes: {
        uid: 123,
        flags: [],
        date: new Date()
      },
      parts: [
        {
          which: 'SUBJECT',
          body: 'body',
          size: new Buffer(subject).length,
        },
        {
          which: 'TEXT',
          body: bodyBase64,
          size: new Buffer(bodyBase64).length
        }
      ]
    };
    
    const donation = service.parseAndExtractDonation(message);
    expect(donation).toBeDefined();
    expect(donation.id).toBe('123');
    expect(donation.email).toBe('test@gmail.com');
    expect(donation.amount).toBe('60.00');
    expect(donation.currency).toBe('RUB');
    expect(donation.createdTimestamp).toBeLessThanOrEqual(Date.now());
  });
});