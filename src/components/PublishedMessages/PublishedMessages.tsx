import * as React from 'react';
import './PublishedMessages.css';
import {MessagesStore} from '../../stores/messages.store';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import {Message} from '../Message/Message';
import {Link} from 'react-router-dom';

interface Props {
  messagesStore: MessagesStore;
  itemsPerPortion: number;
  onMessageClick?: (message: PublishedMessage) => void;
}

interface State {
  messages: PublishedMessage[];
  isNoMessagesLeft: boolean;
}

export class PublishedMessages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      messages: [],
      isNoMessagesLeft: false
    };
    
    this.handleMessageClick = this.handleMessageClick.bind(this);
    this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }

  componentDidMount() {
    this.getNextPortion();
  }
  
  getNextPortion() {
    this.props.messagesStore.getRecentPublishedMessages(
      this.state.messages.length ? this.state.messages[this.state.messages.length - 1].createdTimestamp - 1 : undefined,
      this.props.itemsPerPortion
    )
      .then((messages) => {
        this.setState({
          messages: [
            ...this.state.messages,
            ...messages
          ],
          isNoMessagesLeft: messages.length < this.props.itemsPerPortion,
        });
      })
    ;
  }
  
  render() {
    return (
      <div className="PublishedMessages">
        <div>
          {this.state.messages.map(message => (
            <Link to={`published/${message.blockchainTxId}`} className="item" key={message.blockchainTxId} onClick={() => this.handleMessageClick(message)}>
              <Message message={message} noATag={true}/>
            </Link>
          ))}
        </div>
        {!this.state.isNoMessagesLeft &&
        <p className="text-center">
          <button className="spec-more-btn" onClick={this.handleLoadMoreClick}>Load more</button>
        </p>
        }
      </div>
    );
  }
  
  protected handleMessageClick(message: PublishedMessage) {
    if (this.props.onMessageClick) {
      this.props.onMessageClick(message);
    }
  }
  
  protected handleLoadMoreClick() {
    this.getNextPortion();
  }
}