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
  
  protected handleRequest(req: Request, res: Response) {
    this.blockchainService.pushTransaction('0200000001f4d430f8351f446a9e99aa3331880abe16449af9aef28b86a9ca8d25377f8aa6010000006b483045022100d7e90b5d473c12764e7d6ba06dd70ff8faacc9685355744931595d808b4349f00220602a374c076264a372ba9c3ef9ddc20bd539043d72f167871116e7d195eca99f412103b1cbf7d1ba542babca5a47b940387227d61edc1fe878765d2c0dbbfacba50c85ffffffff020000000000000000216a1f4e657720746573746520206573746561732074642064616664736166647366dc367c4d000000001976a9149d772bca8a0be5a71180ac7fda6c30036fe7b7c788ac00000000')
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