import * as firebase from 'firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './styles/styles.css';
import {useStrict} from 'mobx'; useStrict(true);
import {appConfig} from './config';
import {MessagesStore} from './stores/messages.store';
import {AnalyticsService} from './stores/analytics.service';
import {SpinnerStore} from './stores/spinner.store';
import {App} from './containers/App/App';

// Setup Firebase
firebase.initializeApp({
  apiKey: appConfig.firebase.apiKey,
  authDomain: appConfig.firebase.authDomain,
  databaseURL: appConfig.firebase.databaseURL,
  storageBucket: appConfig.firebase.storageBucket,
});

ReactDOM.render(
  <App messagesStore={new MessagesStore()} spinnerStore={new SpinnerStore()} analyticsService={new AnalyticsService()} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
