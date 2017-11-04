import * as functions from 'firebase-functions';
import {HttpsFunction} from 'firebase-functions';
import {Request, Response} from '@types/express-serve-static-core';
import {ErrorResponse} from '../../models/error-response.model';
import {SuccessResponse} from '../../models/success-response.model';
import {ApiError} from '../../models/api-error.model';

export abstract class BaseFunction {
  /**
   * Public request handler instance
   * @type {HttpsFunction}
   */
  handler: HttpsFunction = functions.https.onRequest(this.handleRequest.bind(this));

  /**
   * Actual request handler method
   * @param {Request} req
   * @param {Response} res
   */
  protected abstract handleRequest(req: Request, res: Response);

  /**
   * Creates common error response
   * @param error
   * @returns {ErrorResponse}
   */
  protected createErrorResponse(error: ApiError): ErrorResponse {
    return {
      success: false,
      errorMessage: error.message,
      errorCode: error.name
    };
  }

  /**
   * Creates common success response
   * @param data
   * @returns {SuccessResponse}
   */
  protected createSuccessResponse<T>(data?: T): SuccessResponse<T> {
    return {
      success: true,
      data: data
    };
  }
}