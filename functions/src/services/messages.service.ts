import * as admin from 'firebase-admin';
import {Message} from '../models/message.model';

export class MessagesService {
  
  constructor(
    protected dbMessages: admin.database.Reference = admin.database().ref('messages')
  ) {
  }

  /**
   * Adds a new message to the DB
   * @param {Message} message
   * @returns {Promise<void>} Created message
   */
  addMessage(message: Message): Promise<Message> {
    message.id = this.dbMessages.push().key;
    
    return this.dbMessages.child(message.id)
      .set(message)
      .then(() => {
        return message;
      })
    ;
  }
}