import * as React from 'react';
import {AppError} from '../../models/app-error.model';
import {inject} from 'mobx-react';
import {MessagesStore} from '../../stores/messages.store';
import {match} from 'react-router';
import './MessagePage.css';
import {sharedConfig} from '../../shared/shared-config';
import {DonationForm} from '../../components/DonationForm/DonationForm';
import {Message} from '../../shared/api-models/message.model';

interface Props {
  match: match<{id: string}>;
  messagesStore: MessagesStore;
}

interface State {
  message?: Message;
}

@inject('messagesStore')
export class MessagePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    
    // Load info about message
    this.props.messagesStore
      .getMessageById(this.props.match.params.id)
      .then(
        m => this.setState({message: m}),
        e => alert(e.message)
      );
    
    this.handleDonateValidationError = this.handleDonateValidationError.bind(this);
    this.handleSubmitDonate = this.handleSubmitDonate.bind(this);
  }
  
  handleDonateValidationError(error: AppError) {
    alert(error.message);
  }
  
  handleSubmitDonate(email: string) {
    alert(email);
  }
  
  render() {
    return (
      <div className="MessagePage">
        <section>
          <div className="section-content">
            <div className="p">
              <div>Your message:</div>
              {this.state.message ? (
                <div>{this.state.message.message}</div>
              ) : ''}
            </div>
            <p className="text-center">
              You need to donate Bitcoin's network transaction fee with PayPal
              so we can successfully push your message to the blockchain.
            </p>
            <div className="p">
              <DonationForm
                donationAmount={sharedConfig.minDonationAmount}
                donationCurrency={sharedConfig.minDonationCurrency}
                onSubmit={this.handleSubmitDonate}
                onValidationError={this.handleDonateValidationError}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}