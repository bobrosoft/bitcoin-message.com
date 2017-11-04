// import fetch from 'node-fetch';
import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'firebase-functions/node_modules/@types/express';
import {BlockchainService} from '../services/blockchain.service';

export class TestFunction extends BaseFunction {
  constructor(
    protected blockchainService: BlockchainService
  ) {
    super();
  }
  
  protected handleRequest(req: Request, res: Response) {
    this.blockchainService.buildOpReturnTransaction('ttest тест 2 😇')
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