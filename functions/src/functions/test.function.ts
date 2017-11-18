// import fetch from 'node-fetch';
import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'firebase-functions/node_modules/@types/express';
import {DonationsService} from '../services/donations.service';

export class TestFunction extends BaseFunction {
  constructor(
    protected donationsService: DonationsService
  ) {
    super();
  }
  
  protected handleRequest(req: Request, res: Response) {
    this.donationsService.getStoredDonationById('dsfds')
      // .then(t => this.blockchainService.pushTransaction(t))
      .then((data) => console.log(data));
    
    res.sendStatus(200);
    // fetch('https://chain.so/api/v2/get_info/BTCTEST')
    //   .then((res) => {
    //     return res.text();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     res.send(data);
    //   })
    // ;
  }
}