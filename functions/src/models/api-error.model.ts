export class ApiError extends Error {
  get code(): ApiErrorCode {
    return this.name as any;
  }
  
  constructor(message: string, code?: ApiErrorCode) {
    super(message);
    this.name = String(code) || this.name;
  }
}

export enum ApiErrorCode {
  HTTP_REQUEST_ERROR = 'HTTP_REQUEST_ERROR' as any,

  DONATION_INSUFFICIENT_AMOUNT = 'DONATION_INSUFFICIENT_AMOUNT' as any,

  MESSAGE_TOO_LONG = 'MESSAGE_TOO_LONG' as any,
  MESSAGE_WRONG_FORMAT = 'MESSAGE_WRONG_FORMAT' as any,
  MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND' as any,
  MESSAGE_ALREADY_PUBLISHED = 'MESSAGE_ALREADY_PUBLISHED' as any,
  
  BLOCKCHAIN_NO_UNSPENT_TRANSACTIONS = 'BLOCKCHAIN_NO_UNSPENT_TRANSACTIONS' as any,
  BLOCKCHAIN_NOT_ENOUGH_FUNDS = 'BLOCKCHAIN_NOT_ENOUGH_FUNDS' as any,
}