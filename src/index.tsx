import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './styles/styles.css';
import {useStrict} from 'mobx'; useStrict(true);
import {App} from './containers/App/App';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
