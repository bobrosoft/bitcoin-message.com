import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'express';
import {MessagesService} from '../services/messages.service';
import {DonationsService} from '../services/donations.service';
import {Donation} from '../models/donation.model';
import {CheckDonationsFunctionPayload} from '../models/check-donations-function-payload.model';
import {CheckDonationsFunctionResponse} from '../models/check-donations-function-response.model';

export class CheckDonationsFunction extends BaseFunction {
  constructor(
    protected messagesService: MessagesService,
    protected donationsService: DonationsService,
  ) {
    super();
  }

  protected async handleRequest(req: Request, res: Response) {
    const payload: CheckDonationsFunctionPayload = req.body;
    
    // Need to update email for message
    if (payload.messageId) {
      await this.messagesService.updateEmailForMessageId(payload.messageId, payload.email);
    }
    
    // Process donations (we use classic "for" here because of await)
    const donations = await this.donationsService.retrieveRecentDonations();
    const processedDonations: Donation[] = [];
    for (const donation of donations) {
      processedDonations.push(await this.donationsService.processDonation(donation));
    }
    
    // Let's find donation for that request
    const requestedDonation = processedDonations.find(d => d.messageId === payload.messageId);
    
    res.send(this.createSuccessResponse<CheckDonationsFunctionResponse>({donation: requestedDonation}));
  }
}