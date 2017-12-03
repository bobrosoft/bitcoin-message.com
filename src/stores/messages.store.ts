import {action} from 'mobx';
import {SuccessResponse} from '../shared/api-models/success-response.model';
import {ErrorResponse} from '../shared/api-models/error-response.model';
import {AppError} from '../models/app-error.model';
import {SaveMessageFunctionResponse} from '../shared/api-models/save-message-function-response.model';
import {SaveMessageFunctionPayload} from '../shared/api-models/save-message-function-payload.model';

export class MessagesStore {
  @action saveMessage(payload: SaveMessageFunctionPayload): Promise<SaveMessageFunctionResponse> {
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
}