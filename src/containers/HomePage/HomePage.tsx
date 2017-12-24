import * as React from 'react';
import './HomePage.css';
import {NewMessageForm} from '../../components/NewMessageForm/NewMessageForm';
import {sharedConfig} from '../../shared/shared-config';
import {AppError} from '../../models/app-error.model';
import {inject} from 'mobx-react';
import {MessagesStore} from '../../stores/messages.store';
import {Message} from '../../shared/api-models/message.model';
import {Redirect} from 'react-router';
import {PublishedMessages} from '../../components/PublishedMessages/PublishedMessages';
import {SpinnerStore} from '../../stores/spinner.store';
import {AnalyticsService} from '../../stores/analytics.service';
import {PublishedMessage} from '../../shared/api-models/published-message.model';

interface Props {
  messagesStore: MessagesStore;
  spinnerStore: SpinnerStore;
  analyticsService: AnalyticsService;
}

interface State {
  createdMessage?: Message;
}

@inject('messagesStore', 'spinnerStore', 'analyticsService')
export class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageValidationError = this.handleMessageValidationError.bind(this);
    this.handlePublishedMessageClick = this.handlePublishedMessageClick.bind(this);
  }
  
  render() {
    if (this.state.createdMessage) {
      return (
        <Redirect to={`/message/${this.state.createdMessage && this.state.createdMessage.id}`} />
      );
    }
    
    return (
      <div className="HomePage">
        <section>
          <div className="section-content">
            <p className="mission">
              Join the revolution!<br/>Save your message in Bitcoin blockchain.<br/>Forever!
            </p>
          </div>
        </section>
        
        <section className="new-message">
          <div className="section-content">
            <NewMessageForm maxLengthBytes={sharedConfig.maxMessageLengthInBytes} onSend={this.handleMessageSend} onValidationError={this.handleMessageValidationError} />
          </div>
        </section>

        <section>
          <div className="section-content">
            <h2>Recent messages</h2>
            <PublishedMessages messagesStore={this.props.messagesStore} itemsPerPortion={15} onMessageClick={this.handlePublishedMessageClick}/>
          </div>
        </section>
        
      </div>
    );
  }

  protected handleMessageSend(message: string) {
    this.props.spinnerStore.setShownState(true);

    this.props.messagesStore.saveMessage({
      message: message, 
    }).then((data) => {
      this.props.analyticsService.trackComponentEvent(this, 'save-message-success');

      this.setState({
        createdMessage: data.createdMessage
      });
    }, (error: AppError) => {
      this.props.analyticsService.trackComponentEvent(this, 'save-message-error', {label: error.name});
      this.props.spinnerStore.setShownState(false);

      alert(error.message);
    });
  }

  protected handleMessageValidationError(error: AppError) {
    this.props.analyticsService.trackComponentEvent(this, 'validation-error', {label: error.name});
    alert(error.message);
  }
  
  protected handlePublishedMessageClick(message: PublishedMessage) {
    this.props.analyticsService.trackComponentEvent(this, 'published-message-click', {label: message.blockchainTxId});
  }
}