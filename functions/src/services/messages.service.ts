import * as admin from 'firebase-admin';
import {Message} from '../models/message.model';
import {BlockchainService} from './blockchain.service';
import {PublishedMessage} from '../models/published-message.model';

export class MessagesService {
  
  constructor(
    protected blockchainService: BlockchainService,
    protected dbMessages: admin.database.Reference = admin.database().ref('messages'),
    protected dbPublishedMessages: admin.database.Reference = admin.database().ref('publishedMessages')
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

  /**
   * Returns last unpublished message for passed email, if exists
   * @param {string} email
   * @returns {Promise<Message>}
   */
  async getLastUnpublishedMessageForEmail(email: string): Promise<Message|undefined> {
    const messages: Message[] = await this.dbMessages
      .orderByChild('email')
      .equalTo(email)
      .limitToLast(10)
      .once('value')
      .then((s) => {
        // Convert snapshot to array
        return Object.keys(s.val() || {})
          .map(k => s.val()[k])
        ;
      })
    ;
    
    // Need to get only last one unpublished
    return messages
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp) // sort desc
      .find(m => !m.isPublished)
    ;
  }

  /**
   * Publishes message in the blockchain
   * @param {Message} message
   * @returns {Promise<Message>}
   */
  async publishMessageInBlockchain(message: Message): Promise<Message> {
    const transaction = await this.blockchainService.buildOpReturnTransaction(message.message);
    const transactionId = await this.blockchainService.pushTransaction(transaction);

    // Update message with transactionId
    message.isPublished = true;
    message.blockchainTxId = transactionId;
    await this.dbMessages.child(message.id).set(message);
    
    // Add to published messages
    const publishedMessage: PublishedMessage = {
      message: message.message,
      blockchainTxId: message.blockchainTxId,
      createdTimestamp: Date.now()
    };
    await this.dbPublishedMessages.child(message.blockchainTxId).set(publishedMessage);
    
    return message;
  }
}