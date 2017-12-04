import {sharedConfig} from './shared/shared-config';

let appConfig = {
  messages: {
    maxMessageLengthInBytes: sharedConfig.maxMessageLengthInBytes,
  },
  
  donations: {
    minDonationAmount: sharedConfig.minDonationAmount,
    minDonationCurrency: sharedConfig.minDonationCurrency,
    minDonationAmountRU: 80, // TODO: rewrite that to exchange rates service
    minDonationCurrencyRU: 'RUB'
  }
};

export {appConfig};