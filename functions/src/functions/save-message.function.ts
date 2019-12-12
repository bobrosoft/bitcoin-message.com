import {BaseFunction} from './shared/base.function';
import {Request, Response} from 'express';
import {ApiError, ApiErrorCode} from '../models/api-error.model';
import {SaveMessageFunctionPayload} from '../models/shared/save-message-function-payload.model';
import {MessagesService} from '../services/messages.service';
import {SaveMessageFunctionResponse} from '../models/shared/save-message-function-response.model';
import {sharedConfig} from '../shared-config';
import {ProjectConfig} from '../models/project-config.model';

export class SaveMessageFunction extends BaseFunction {
  constructor(
    protected config: ProjectConfig,
    protected messagesService: MessagesService
  ) {
    super();
  }
  
  async handleRequest(req: Request, res: Response) {
    try {
      const payload: SaveMessageFunctionPayload = req.body;
      const currentIp = this.getIpFromRequest(req);
      
      // Validate payload
      await this.validatePayload(payload);

      // Save message
      let createdMessage = await this.messagesService.addMessage(payload.message, currentIp);

      // Check if "free messages" allowed
      if (Number(this.config.donations.free_messages_limit)) {
        // Check how much messages sent today
        let publishedCount = 0;
        let isPublishedWithCurrentIp = false;
        const messages = await this.messagesService.getPublishedMessagesForDay();
        messages.forEach((m) => {
          if (m.isPublished) {
            publishedCount++;
            isPublishedWithCurrentIp = isPublishedWithCurrentIp || (m.clientIp && m.clientIp === currentIp);
          }
        });

        // Check if that IP already sent that message
        if (publishedCount < Number(this.config.donations.free_messages_limit) && !isPublishedWithCurrentIp) {
          createdMessage = await this.messagesService.publishMessageInBlockchain(createdMessage);
        }
      }

      res.send(this.createSuccessResponse<SaveMessageFunctionResponse>({
        createdMessage: createdMessage
      }));
    } catch (e) {
      console.error(e);
      res.status(400).send(this.createErrorResponse(e));
    }
  }

  /**
   * Returns IP from request
   * @param req
   * @returns
   */
  getIpFromRequest(req: Request): string | undefined {
    const matches = (req.headers && req.headers['x-forwarded-for'] || '').match(/(\d+.\d+.\d+.\d+)$/);
    return matches && matches[1] || undefined;
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