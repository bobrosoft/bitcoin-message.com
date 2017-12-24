import * as React from 'react';
import {inject} from 'mobx-react';
import {match} from 'react-router';
import './PublishedMessagePage.css';
import {MessagesStore} from '../../stores/messages.store';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import {Message} from '../../components/Message/Message';
import {Link} from 'react-router-dom';
import {ShareButtons} from '../../components/ShareButtons/ShareButtons';
import {AnalyticsService} from '../../stores/analytics.service';

interface Props {
  match: match<{id: string}>;
  location: Location;
  analyticsService: AnalyticsService;
  messagesStore: MessagesStore;
}

interface State {
  publishedMessage?: PublishedMessage;
}

@inject('messagesStore', 'analyticsService')
export class PublishedMessagePage extends React.Component<Props, State> {

  get blockchainTxId(): string {
    return this.props.match.params.id;
  }
  
  get isJustPublished(): boolean {
    return this.props.messagesStore.lastPublishedMessage!
      && this.blockchainTxId === this.props.messagesStore.lastPublishedMessage!.blockchainTxId
      ;
  }
  
  constructor(props: Props) {
    super(props);
    this.state = {};

    this.retrievePublishedMessageInfo();
  }
  
  componentDidMount() {
    this.props.analyticsService.trackComponentEvent(this, 'view', {label: this.blockchainTxId});
    
    if (this.isJustPublished) {
      this.props.analyticsService.trackComponentEvent(this, 'view-just-published', {label: this.blockchainTxId});
    }
  }
  
  render() {
    if (!this.state.publishedMessage) {
      return '';
    }
    
    return (
      <div className="PublishedMessagePage">
        <section>
          <div className="section-content">
            <h2 className="success-title text-center">Successfully pushed<br/>to Bitcoin blockchain!</h2>
            {this.state.publishedMessage &&
              <Message message={this.state.publishedMessage} />
            }
          </div>
        </section>
        
        <section>
          <div className="section-content text-center">
            {this.isJustPublished &&
            <h3>Why not share it with the world?</h3>
            }
            <ShareButtons title={'My message in Bitcoin blockchain'} description={'Bitcoin-message.com: Save your message in Bitcoin blockchain! Forever!'} />
          </div>
        </section>

        <section>
          <div className="section-content text-center">
            <br/><br/>
            <Link to={''}>{this.isJustPublished ? 'Write another message' : 'Write your own message'}</Link>
          </div>
        </section>
      </div>
    );
  }

  protected retrievePublishedMessageInfo() {
    this.props.messagesStore
      .getPublishedMessageById(this.props.match.params.id)
      .then(
        m => this.setState({publishedMessage: m}),
        e => alert(e.message)
      )
    ;
  }
}