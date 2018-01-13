import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'express';
import {ApiError, ApiErrorCode} from '../models/api-error.model';
import {SaveMessageFunctionPayload} from '../models/shared/save-message-function-payload.model';
import {MessagesService} from '../services/messages.service';
import {SaveMessageFunctionResponse} from '../models/shared/save-message-function-response.model';
import {sharedConfig} from '../shared-config';

export class SaveMessageFunction extends BaseFunction {
  constructor(
    protected messagesService: MessagesService
  ) {
    super();
  }
  
  protected handleRequest(req: Request, res: Response) {
    let payload: SaveMessageFunctionPayload;
    
    Promise.resolve(true)
      .then(() => {
        payload = req.body;
      })
      .then(() => {
        // Validating payload
        return this.validatePayload(payload);
      })
      .then(() => {
        // Save message
        return this.messagesService.addMessage({
          message: payload.message,
          isPublished: false,
          createdTimestamp: Date.now(),
        });
      })
      .then((createdMessage) => {
        res.send(this.createSuccessResponse<SaveMessageFunctionResponse>({
          createdMessage: createdMessage
        }));
      })
      .catch((err: ApiError) => {
        console.log(err);
        res.status(400).send(this.createErrorResponse(err));
      })
    ;
  }

  /**
   * Validates payload
   * @param {SaveMessageFunctionPayload} payload
   * @returns {Promise<boolean>}
   */
  protected validatePayload(payload: SaveMessageFunctionPayload): Promise<boolean> {
    // if (!payload.email || !payload.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
    //   return Promise.reject(new ApiError('Wrong email format', 'WRONG_EMAIL_FORMAT'));
    // }

    if (!payload.message || !payload.message.length) {
      return Promise.reject(new ApiError('Wrong message format', ApiErrorCode.MESSAGE_WRONG_FORMAT));
    }

    const maxLength = sharedConfig.maxMessageLengthInBytes;
    if (new Buffer(payload.message).length > maxLength) {
      return Promise.reject(new ApiError(`Message is too long (max: ${maxLength} bytes)`, ApiErrorCode.MESSAGE_TOO_LONG));
    }
    
    return Promise.resolve(true);
  }
}