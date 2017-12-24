import * as React from 'react';
import './App.css';
import {Provider} from 'mobx-react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import {Route} from 'react-router';
import {AnalyticsService} from '../../stores/analytics.service';
import {MessagesStore} from '../../stores/messages.store';
import {HomePage} from '../HomePage/HomePage';
import {MessagePage} from '../MessagePage/MessagePage';
import {PublishedMessagePage} from '../PublishedMessagePage/PublishedMessagePage';
import {Spinner} from '../../components/Spinner/Spinner';
import {SpinnerStore} from '../../stores/spinner.store';
import {TermsCondPage} from '../TermsCondPage/TermsCondPage';
import {TrackPageview} from '../../components/TrackPageview/TrackPageview';

interface Props {
  messagesStore: MessagesStore;
  spinnerStore: SpinnerStore;
  analyticsService: AnalyticsService;
}

export class App extends React.Component<Props> {
  render() {
    return (
      <Provider messagesStore={this.props.messagesStore} spinnerStore={this.props.spinnerStore} analyticsService={this.props.analyticsService}>
        <Router>
          <div className="App">
            <div className="App--header">
              <div className="bg-body"/>
              <div className="content">
                <Link to={''} title="Bitcoin Message"><img className="logo" src="/assets/common/logo.svg" alt="Bitcoin Message"/></Link>
              </div>
            </div>
            
            <div className="App--content">
              <Route path="/" component={TrackPageview} />
              <Route exact={true} path="/" component={HomePage}/>
              <Route path="/message/:id" component={MessagePage}/>
              <Route path="/published/:id" component={PublishedMessagePage}/>
              <Route path="/terms-and-conditions" component={TermsCondPage}/>
            </div>

            <div className="App--footer">
              <div className="content">
                <div>
                  <div className="title">Idea, Design and Development</div>
                  <div><Link to="https://github.com/bobrosoft" target="_blank">Vladimir Tolstikov</Link></div>
                </div>
                <div className="text-right">
                  <div><Link to={'/terms-and-conditions#tc'}>Terms and Conditions</Link></div>
                  <div><Link to={'/terms-and-conditions#disclaimer'}>Disclaimer</Link></div>
                  <div><a href="mailto:support@bitcoin-message.com" target="_blank">Support</a></div>
                  <div><Link to={'/todo'} target="_blank">GitHub</Link></div>
                </div>
              </div>
            </div>
            
            <Spinner/>
          </div>
        </Router>
      </Provider>
    );
  }
}
