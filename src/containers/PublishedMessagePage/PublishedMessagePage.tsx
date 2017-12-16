import * as React from 'react';
import {inject} from 'mobx-react';
import {match} from 'react-router';
import './PublishedMessagePage.css';
import {MessagesStore} from '../../stores/messages.store';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import {Message} from '../../components/Message/Message';
import {Link} from 'react-router-dom';
import {ShareButtons} from '../../components/ShareButtons/ShareButtons';

interface Props {
  match: match<{id: string}>;
  location: Location;
  messagesStore: MessagesStore;
}

interface State {
  publishedMessage?: PublishedMessage;
}

@inject('messagesStore')
export class PublishedMessagePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};

    this.retrievePublishedMessageInfo();
  }
  
  get isJustPublished(): boolean {
    return this.state.publishedMessage! && this.props.messagesStore.lastPublishedMessage!
      && this.state.publishedMessage!.blockchainTxId === this.props.messagesStore.lastPublishedMessage!.blockchainTxId
    ;
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