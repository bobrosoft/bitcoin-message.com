import * as functions from 'firebase-functions';
import {HttpsFunction} from 'firebase-functions';
import * as cors from 'cors';
import {Request, Response} from 'express-serve-static-core';
import {ErrorResponse} from '../../models/error-response.model';
import {SuccessResponse} from '../../models/success-response.model';
import {ApiError} from '../../models/api-error.model';

export abstract class BaseFunction {
  /**
   * Public request handler instance
   * @type {HttpsFunction}
   */
  handler: HttpsFunction = functions.https.onRequest((req, res) => {
    cors({origin: true})(req, res, () => {
      this.handleRequest(req, res);
    });
  });

  /**
   * Actual request handler method
   * @param {Request} req
   * @param {Response} res
   */
  protected abstract handleRequest(req: Request, res: Response): void;

  /**
   * Creates common error response.
   * IMPORTANT! Should be strictly used with proper HTTP code (400+)
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
  protected createSuccessResponse<T>(data?: T): SuccessResponse<T | undefined> {
    return {
      success: true,
      data: data
    };
  }
}