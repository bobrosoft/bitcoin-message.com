import * as React from 'react';
import {NewMessageForm} from '../../components/NewMessageForm/NewMessageForm';
import {sharedConfig} from '../../shared/shared-config';
import {AppError} from '../../models/app-error.model';
import {inject} from 'mobx-react';
import {MessagesStore} from '../../stores/messages.store';
import {Message} from '../../shared/api-models/message.model';
import {Redirect} from 'react-router';

interface Props {
  messagesStore: MessagesStore;
}

interface State {
  createdMessage?: Message;
}

@inject('messagesStore')
export class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageValidationError = this.handleMessageValidationError.bind(this);
  }
  
  handleMessageSend(message: string) {
    this.props.messagesStore.saveMessage({
      message: message,
    }).then((data) => {
      this.setState({
        createdMessage: data.createdMessage
      });
    }, (error: AppError) => {
      alert(error.message);
    });
  }

  handleMessageValidationError(error: AppError) {
    alert(error.message);
  }
  
  render() {
    if (this.state.createdMessage) {
      return (
        <Redirect to={`/message/${this.state.createdMessage && this.state.createdMessage.id}`} />
      );
    }
    
    return (
      <div>
        <section>
          <div className="section-content">
            <NewMessageForm maxLengthBytes={sharedConfig.maxMessageLengthInBytes} onSend={this.handleMessageSend} onValidationError={this.handleMessageValidationError} />
          </div>
        </section>
      </div>
    );
  }
}