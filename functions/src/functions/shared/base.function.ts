import * as functions from 'firebase-functions'
import {HttpsFunction} from 'firebase-functions';
import {Request, Response} from "@types/express-serve-static-core";

export abstract class BaseFunction {
  handler: HttpsFunction = functions.https.onRequest(this.handlerBody.bind(this));
  
  protected abstract handlerBody(req: Request, res: Response);
}