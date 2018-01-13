import * as admin from 'firebase-admin';
import {BlockchainService} from '../models/blockchain-service.model';
import {Message} from '../models/shared/message.model';
import {PublishedMessage} from '../models/shared/published-message.model';
import {ApiError, ApiErrorCode} from '../models/api-error.model';

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
    message.id = this.dbMessages.push().key as string;
    
    return this.dbMessages.child(message.id)
      .set(message)
      .then(() => {
        return message;
      })
    ;
  }

  /**
   * Updates email for message
   * @param {string} messageId
   * @param {string} email
   * @returns {Promise<any>}
   */
  async updateEmailForMessageId(messageId: string, email: string): Promise<any> {
    const currentValue: admin.database.DataSnapshot = await this.dbMessages.child(messageId).once('value');
    
    if (!currentValue.exists()) {
      throw new ApiError('No entry found', ApiErrorCode.MESSAGE_NOT_FOUND);
    }
    
    if ((currentValue.val() as Message).isPublished) {
      throw new ApiError('Entry is already published', ApiErrorCode.MESSAGE_ALREADY_PUBLISHED);
    }
    
    return currentValue.ref.child('email').set(email);
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
    const transactionPayload = await this.blockchainService.buildOpReturnTransaction(message.message);
    const transaction = await this.blockchainService.pushTransaction(transactionPayload);

    // Update message with transactionId
    message.isPublished = true;
    message.blockchainNetwork = transaction.network;
    message.blockchainTxId = transaction.txId;
    await this.dbMessages.child(message.id!).set(message);
    
    // Add to published messages
    const publishedMessage: PublishedMessage = {
      message: message.message,
      blockchainNetwork: transaction.network,
      blockchainTxId: message.blockchainTxId,
      createdTimestamp: Date.now()
    };
    await this.dbPublishedMessages.child(message.blockchainTxId).set(publishedMessage);
    
    return message;
  }
}