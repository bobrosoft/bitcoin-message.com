export interface AppConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
  }
  
  api: {
    baseUrl: string;
  }

  messages: {
    maxMessageLengthInBytes: number;
  }

  donations: {
    minDonationAmount: number;
    minDonationCurrency: string;
    minDonationAmountRU: number;
    minDonationCurrencyRU: 'RUB';
  },
  
  analytics: {
    ga: {
      trackingId: string;
    }
  }
}