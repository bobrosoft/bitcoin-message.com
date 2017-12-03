import {action} from 'mobx';
import * as firebase from 'firebase';
import {SuccessResponse} from '../shared/api-models/success-response.model';
import {ErrorResponse} from '../shared/api-models/error-response.model';
import {AppError} from '../models/app-error.model';
import {SaveMessageFunctionResponse} from '../shared/api-models/save-message-function-response.model';
import {SaveMessageFunctionPayload} from '../shared/api-models/save-message-function-payload.model';
import {Message} from '../shared/api-models/message.model';

export class MessagesStore {
  readonly ERROR_NO_ENTRY = 'MessagesStore.ERROR_NO_ENTRY';
  
  dbMessages: firebase.database.Reference = firebase.database().ref('messages');
  
  @action saveMessage(payload: SaveMessageFunctionPayload): Promise<SaveMessageFunctionResponse> {
    // TODO: config
    return fetch('http://localhost:5000/bitcoin-message-dev/us-central1/saveMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then((response: SuccessResponse<SaveMessageFunctionResponse> | ErrorResponse) => {
        if (!response.success) {
          throw new AppError(response.errorMessage, response.errorCode);
        }
      
        return response.data;
      })
    ;
  }

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
}