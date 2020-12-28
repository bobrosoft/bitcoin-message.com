// import fetch from 'node-fetch';
import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'firebase-functions/node_modules/@types/express';
import {BlockchainService} from '../models/blockchain-service.model';

export class TestFunction extends BaseFunction {
  constructor(
    protected blockchainService: BlockchainService
  ) {
    super();
  }
  
  handleRequest(req: Request, res: Response) {
    this.blockchainService.getUnspentTransactions()
      .then((data) => console.log(data));

    this.blockchainService.buildOpReturnTransaction('test')
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