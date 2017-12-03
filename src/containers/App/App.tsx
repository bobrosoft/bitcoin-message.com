import * as React from 'react';
import * as firebase from 'firebase';
import './App.css';
import {Provider} from 'mobx-react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router';
import {MessagesStore} from '../../stores/messages.store';
import {HomePage} from '../HomePage/HomePage';
import {MessagePage} from '../MessagePage/MessagePage';

// Setup Firebase
// TODO: config
firebase.initializeApp({
  apiKey: 'AIzaSyDEkqTbmC0J5ZlbcGR3Cx5wWW6ne-Ac34E',
  authDomain: 'bitcoin-message-dev.firebaseapp.com',
  databaseURL: 'https://bitcoin-message-dev.firebaseio.com',
  storageBucket: 'bitcoin-message-dev.appspot.com',
});

export class App extends React.Component {
  render() {
    return (
      <Provider messagesStore={new MessagesStore()}>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to ReactDDD</h2>
          </div>
          <Router>
            <div>
              <Route exact={true} path="/" component={HomePage}/>
              <Route path="/message/:id" component={MessagePage}/>
              {/*<Route path="/topics" component={Second}/>*/}
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}
