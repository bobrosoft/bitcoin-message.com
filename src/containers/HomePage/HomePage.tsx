import * as React from 'react';
import {NewMessage} from '../../components/NewMessage/NewMessage';
import {sharedConfig} from '../../shared/shared-config';
import {AppError} from '../../models/app-error.model';

export class HomePage extends React.Component {
  constructor(props: {}) {
    super(props);
    
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageValidationError = this.handleMessageValidationError.bind(this);
  }
  
  handleMessageSend(message: string) {
    console.log(message);
  }

  handleMessageValidationError(error: AppError) {
    alert(error.message);
  }
  
  render() {
    return (
      <section>
        <div className="section-content">
          <NewMessage maxLengthBytes={sharedConfig.maxMessageLengthInBytes} onSend={this.handleMessageSend} onValidationError={this.handleMessageValidationError} />
        </div>
      </section>
    );
  }
}