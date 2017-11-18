import {ApiError} from '../models/api-error.model';

export class ExchangeRatesService {
  /**
   * Converts amount from one currency to another based on current exchange rates
   * @param {string} amount
   * @param {string} amountCurrency
   * @param {string} toCurrency
   * @returns {string}
   */
  convert(amount: string, amountCurrency: string, toCurrency: string): string {
    if (amountCurrency === toCurrency) {
      return amount;
    }

    const pair = toCurrency + '/' + amountCurrency;
    let rate: number;

    // TODO: need to change that to proper implementation
    switch (pair) {
      case 'USD/RUB':
        rate = 60;
        break;
        
      default:
        throw new ApiError(`Unsupported pair ${pair}`);
    }
    
    return (Number(amount) / rate).toFixed(2);
  }
}