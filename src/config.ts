import {AppConfig} from './models/app-config.model';
import {sharedConfig} from './shared/shared-config';
import {mergeDeep} from './shared/merge-deep';

// Base/dev config
const baseConfig: AppConfig = {
  firebase: {
    apiKey: 'AIzaSyDEkqTbmC0J5ZlbcGR3Cx5wWW6ne-Ac34E',
    authDomain: 'bitcoin-message-dev.firebaseapp.com',
    databaseURL: 'https://bitcoin-message-dev.firebaseio.com',
    storageBucket: 'bitcoin-message-dev.appspot.com',
  },
  
  api: {
    baseUrl: 'http://localhost:5000/bitcoin-message-dev/us-central1',
  },
  
  messages: {
    maxMessageLengthInBytes: sharedConfig.maxMessageLengthInBytes,
  },
  
  donations: {
    minDonationAmount: sharedConfig.minDonationAmount,
    minDonationCurrency: sharedConfig.minDonationCurrency,
    minDonationAmountRU: 80, // TODO: rewrite that to exchange rates service
    minDonationCurrencyRU: 'RUB'
  },
  
  analytics: {
    ga: {
      trackingId: 'UA-6315511-13'
    }
  }
};

// Live config (overrides)
const liveConfigOverride: Partial<AppConfig> = {
  firebase: {
    apiKey: 'AIzaSyA7x7rl9jym6C2Xvlg1XEwLuUhJVDCTCWU',
    authDomain: 'bitcoin-message.firebaseapp.com',
    databaseURL: 'https://bitcoin-message.firebaseio.com',
    storageBucket: 'bitcoin-message.appspot.com',
  },
};

// Combined result config
const appConfig: AppConfig = (() => {
  if (process.env.REACT_APP_CONFIG_ENV === 'prod') {
    return mergeDeep(baseConfig, liveConfigOverride);
  }
  
  return baseConfig;
})();

export {appConfig};