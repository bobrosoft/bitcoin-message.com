import {action, observable} from 'mobx';
import * as firebase from 'firebase';
import {BaseApiStore} from './base-api.store';
import {AppError} from '../models/app-error.model';
import {Message} from '../models/shared/message.model';
import {SaveMessageFunctionResponse} from '../models/shared/save-message-function-response.model';
import {SaveMessageFunctionPayload} from '../models/shared/save-message-function-payload.model';
import {CheckDonationsFunctionPayload} from '../models/shared/check-donations-function-payload.model';
import {CheckDonationsFunctionResponse} from '../models/shared/check-donations-function-response.model';
import {PublishedMessage} from '../models/shared/published-message.model';

export class MessagesStore extends BaseApiStore {
  readonly ERROR_NO_ENTRY = 'MessagesStore.ERROR_NO_ENTRY';
  
  @observable lastPublishedMessage?: Message;
  
  protected dbMessages: firebase.database.Reference = firebase.database().ref('messages');
  protected dbPublishedMessages: firebase.database.Reference = firebase.database().ref('publishedMessages');

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
   * Returns last published messages
   * @param {number} startFromTimestamp
   * @param {number} limit
   * @returns {Promise<PublishedMessage[]>}
   */
  @action getRecentPublishedMessages(startFromTimestamp: number = 9999999999999, limit: number = 30): Promise<PublishedMessage[]> {
    // NOTE: executing queries with sorting in Firebase.Database is a f*cking pain! :(
    return this.dbPublishedMessages
      .orderByChild('createdTimestamp')
      .endAt(startFromTimestamp)
      .limitToLast(limit)
      .once('value')
      .then((s: firebase.database.DataSnapshot) => {
        const result: PublishedMessage[] = [];
        s.forEach((v) => {
          result.push(v.val());
          return false;
        });
        
        return result.reverse();
      })
    ;
  }

  /**
   * Saves new message to API
   * @param {SaveMessageFunctionPayload} payload
   * @returns {Promise<SaveMessageFunctionResponse>}
   */
  @action saveMessage(payload: SaveMessageFunctionPayload): Promise<SaveMessageFunctionResponse> {
    return this.postJSON('/saveMessage', payload);
  }

  /**
   * Checks message status
   * @param {CheckDonationsFunctionPayload} payload
   * @returns {Promise<CheckDonationsFunctionResponse>}
   */
  @action checkMessageStatus(payload: CheckDonationsFunctionPayload): Promise<CheckDonationsFunctionResponse> {
    return this.postJSON('/checkDonations', payload);
  }

  /**
   * Remembers last published message
   * @param {Message} message
   */
  @action rememberLastPublishedMessage(message: Message) {
    this.lastPublishedMessage = message;
  }
}