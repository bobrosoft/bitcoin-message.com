import * as React from 'react';
import * as firebase from 'firebase';
import './App.css';
import {Provider} from 'mobx-react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import {Route} from 'react-router';
import {MessagesStore} from '../../stores/messages.store';
import {HomePage} from '../HomePage/HomePage';
import {MessagePage} from '../MessagePage/MessagePage';
import {PublishedMessagePage} from '../PublishedMessagePage/PublishedMessagePage';

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
        <Router>
          <div className="App">
            <div className="header">
              <div className="bg-body"/>
              <div className="content">
                <Link to={''} title="Bitcoin Message"><img className="logo" src="/assets/common/logo.svg" alt="Bitcoin Message"/></Link>
              </div>
            </div>
            <div>
              <Route exact={true} path="/" component={HomePage}/>
              <Route path="/message/:id" component={MessagePage}/>
              <Route path="/published/:id" component={PublishedMessagePage}/>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}
