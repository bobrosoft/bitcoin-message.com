import {action, observable} from 'mobx';
import * as firebase from 'firebase';
import {BaseApiStore} from './base-api.store';
import {AppError} from '../models/app-error.model';
import {Message} from '../shared/api-models/message.model';
import {SaveMessageFunctionResponse} from '../shared/api-models/save-message-function-response.model';
import {SaveMessageFunctionPayload} from '../shared/api-models/save-message-function-payload.model';
import {CheckDonationsFunctionPayload} from '../shared/api-models/check-donations-function-payload.model';
import {CheckDonationsFunctionResponse} from '../shared/api-models/check-donations-function-response.model';
import {PublishedMessage} from '../shared/api-models/published-message.model';

export class MessagesStore extends BaseApiStore {
  readonly ERROR_NO_ENTRY = 'MessagesStore.ERROR_NO_ENTRY';
  
  @observable lastPublishedMessage?: Message;
  
  protected dbMessages: firebase.database.Reference = firebase.database().ref('messages');
  protected dbPublishedMessages: firebase.database.Reference = firebase.database().ref('publishedMessages');

  /**
   * Saves new message to API
   * @param {SaveMessageFunctionPayload} payload
   * @returns {Promise<SaveMessageFunctionResponse>}
   */
  @action saveMessage(payload: SaveMessageFunctionPayload): Promise<SaveMessageFunctionResponse> {
    return this.postJSON('/saveMessage', payload);
  }

  /**
   * Returns actual info about message by ID
   * @param {string} id
   * @returns {Promise<Message>}
   */
  @action getMessageById(id: string): Promise<Message> {
    return this.dbMessages.child(id).once('value')
      .then((s) => {
        if (!s.val()) {
          throw new AppError('No entry found', this.ERROR_NO_ENTRY);
        }
        
        return s.val();
      })
    ;
  }

  /**
   * 
   * @param {CheckDonationsFunctionPayload} payload
   * @returns {Promise<CheckDonationsFunctionResponse>}
   */
  @action checkMessageStatus(payload: CheckDonationsFunctionPayload): Promise<CheckDonationsFunctionResponse> {
    return this.postJSON('/checkDonations', payload);
  }

  /**
   * Returns published message by ID
   * @param {string} id
   * @returns {Promise<Message>}
   */
  @action getPublishedMessageById(id: string): Promise<PublishedMessage> {
    return this.dbPublishedMessages.child(id).once('value')
      .then((s) => {
        if (!s.val()) {
          throw new AppError('No entry found', this.ERROR_NO_ENTRY);
        }

        return s.val();
      })
    ;
  }

  /**
   * Remembers last published message
   * @param {Message} message
   */
  @action rememberLastPublishedMessage(message: Message) {
    this.lastPublishedMessage = message;
  }
}