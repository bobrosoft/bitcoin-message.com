import {SuccessResponse} from '../shared/api-models/success-response.model';
import {ErrorResponse} from '../shared/api-models/error-response.model';
import {AppError} from '../models/app-error.model';

export abstract class BaseApiStore {
  postJSON(path: string, payload: any): Promise<any> {
    // TODO: config
    return fetch('http://localhost:5000/bitcoin-message-dev/us-central1' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then((response: SuccessResponse<any> | ErrorResponse) => {
        if (!response.success) {
          throw new AppError(response.errorMessage, response.errorCode);
        }

        return response.data;
      })
      .catch((e) => {
        if (e.message === 'Type error') {
          e.message = 'Failed to fetch';
        }
        
        throw e;
      })
    ;
  }
}