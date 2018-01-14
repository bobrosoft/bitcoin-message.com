import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'express';
import {MessagesService} from '../services/messages.service';
import {DonationsService} from '../services/donations.service';
import {Donation} from '../models/shared/donation.model';
import {CheckDonationsFunctionPayload} from '../models/shared/check-donations-function-payload.model';
import {CheckDonationsFunctionResponse} from '../models/shared/check-donations-function-response.model';

export class CheckDonationsFunction extends BaseFunction {
  constructor(
    protected messagesService: MessagesService,
    protected donationsService: DonationsService,
  ) {
    super();
  }

  protected async handleRequest(req: Request, res: Response) {
    try {
      const payload: CheckDonationsFunctionPayload = req.body;

      // Need to update email for message
      if (payload.messageId) {
        await this.messagesService.updateEmailForMessageId(payload.messageId, payload.email);
      }

      // Process donations (I use classic "for" here because of await)
      const donations = await this.donationsService.retrieveRecentDonations();
      console.info('Recent donations', donations);
      
      const processedDonations: Donation[] = [];
      for (const donation of donations) {
        processedDonations.push(await this.donationsService.processDonation(donation));
      }

      // Let's find donation for that request
      const requestedDonation = processedDonations.find(d => d.messageId && d.messageId === payload.messageId);

      res.send(this.createSuccessResponse<CheckDonationsFunctionResponse>({donation: requestedDonation}));
    } catch (e) {
      console.log(e);
      res.status(400).send(this.createErrorResponse(e));
    }
  }
}