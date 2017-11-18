import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'express';
import {DonationsService} from '../services/donations.service';
import {Donation} from '../models/donation.model';
import {CheckDonationsFunctionPayload} from '../models/check-donations-function-payload.model';
import {CheckDonationsFunctionResponse} from '../models/check-donations-function-response.model';

export class CheckDonationsFunction extends BaseFunction {
  constructor(
    protected donationsService: DonationsService,
  ) {
    super();
  }

  protected async handleRequest(req: Request, res: Response) {
    const payload: CheckDonationsFunctionPayload = req.body;
    const donations = await this.donationsService.retrieveRecentDonations();

    // Process donations first (we use classic "for" here because of await)
    const processedDonations: Donation[] = [];
    for (const donation of donations) {
      processedDonations.push(await this.donationsService.processDonation(donation));
    }
    
    // Let's sort and find donation for that request
    const requestedDonation = processedDonations
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp) // sort desc by creation time
      .find(d => d.email === payload.email)
    ;
    
    res.send(this.createSuccessResponse<CheckDonationsFunctionResponse>({donation: requestedDonation}));
  }
}