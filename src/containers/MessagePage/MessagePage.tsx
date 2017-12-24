import * as React from 'react';
import {AppError} from '../../models/app-error.model';
import {inject} from 'mobx-react';
import {MessagesStore} from '../../stores/messages.store';
import {match, Redirect} from 'react-router';
import './MessagePage.css';
import {DonationForm} from '../../components/DonationForm/DonationForm';
import {Message as MessageComp} from '../../components/Message/Message';
import {Message} from '../../shared/api-models/message.model';
import {appConfig} from '../../config';
import {SpinnerStore} from '../../stores/spinner.store';
import {AnalyticsService} from '../../stores/analytics.service';

interface Props {
  match: match<{id: string}>;
  messagesStore: MessagesStore;
  spinnerStore: SpinnerStore;
  analyticsService: AnalyticsService;
}

interface State {
  donationAmount: number;
  donationCurrency: string;
  isRetrieveMessageInfoInProgress: boolean;
  isCheckDonationStatusInProgress: boolean;
  message?: Message;
  donorEmail?: string;
}

@inject('messagesStore', 'spinnerStore')
export class MessagePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      donationAmount: this.isUserFromRussia() ? appConfig.donations.minDonationAmountRU : appConfig.donations.minDonationAmount,
      donationCurrency: this.isUserFromRussia() ? appConfig.donations.minDonationCurrencyRU : appConfig.donations.minDonationCurrency,
      isRetrieveMessageInfoInProgress: false,
      isCheckDonationStatusInProgress: false
    };
    
    this.handleDonateValidationError = this.handleDonateValidationError.bind(this);
    this.handleSubmitDonate = this.handleSubmitDonate.bind(this);
    this.handleCheckDonationStatusClick = this.handleCheckDonationStatusClick.bind(this);
  }
  
  componentDidMount() {
    // Load info about message
    this.retrieveMessageInfo();
  }

  render() {
    // Control spinner state
    setTimeout(() => {
      this.props.spinnerStore.setShownState(this.state.isRetrieveMessageInfoInProgress || this.state.isCheckDonationStatusInProgress);
    }, 0);
    
    // Display nothing if no message received yet
    if (!this.state.message) {
      return '';
    }
    
    if (this.state.message && this.state.message.isPublished) {
      this.props.messagesStore.rememberLastPublishedMessage(this.state.message);
      
      return (
        <Redirect to={`/published/${this.state.message.blockchainTxId}`} />
      );
    }
    
    return (
      <div className="MessagePage">
        <section>
          <div className="section-content">
            <h2>Your message:</h2>
            <div className="p">
              {this.state.message &&
              <MessageComp message={{message: this.state.message.message, createdTimestamp: this.state.message.createdTimestamp, blockchainTxId: ''}} />
              }
            </div>
            <p className="text-center">
              You need to donate Bitcoin's network transaction fee with PayPal
              so we can successfully push your message to the blockchain.
            </p>
            <div className="p">
              <DonationForm
                donationAmount={this.state.donationAmount}
                donationCurrency={this.state.donationCurrency}
                onSubmit={this.handleSubmitDonate}
                onValidationError={this.handleDonateValidationError}
              />
            </div>
            {this.state.donorEmail &&
              <div className="text-center">
                <p><i className="fa fa-arrow-down"/></p>
                <p>
                  <button className="primary" onClick={this.handleCheckDonationStatusClick}>Check Donation Status</button>
                </p>
              </div>
            }
          </div>
        </section>
      </div>
    );
  }

  /**
   * Returns TRUE if user is from Russia (needed because of PayPal donations restrictions)
   * @returns {boolean}
   */
  isUserFromRussia(): boolean {
    return window.navigator.languages.indexOf('ru') !== -1
      || window.navigator.languages.indexOf('ru-RU') !== -1
      || !!window.navigator.language.match('ru')
    ;
  }

  /**
   * Loads info about current message from server and store it to state
   */
  protected retrieveMessageInfo(): Promise<Message | void> {
    this.setState({isRetrieveMessageInfoInProgress: true});
    
    return this.props.messagesStore
      .getMessageById(this.props.match.params.id)
      .then((message) => {
        this.setState({
          message: message,
          isRetrieveMessageInfoInProgress: false
        });
        
        return message;
      })
      .catch((error) => {
        this.setState({isRetrieveMessageInfoInProgress: false});
        alert(error.message);
      });
  }

  /**
   * Checks donation status using current state data
   * @param {boolean} isSilent  If TRUE, will not show any alerts
   */
  protected checkDonationStatus(isSilent: boolean = false) {
    this.setState({isCheckDonationStatusInProgress: true});
    
    this.props.messagesStore.checkMessageStatus({
      messageId: this.state.message!.id!,
      email: this.state.donorEmail!,
    }).then(response => {
      this.setState({isCheckDonationStatusInProgress: false});
      
      // Check if we found donation
      if (response.donation) {
        // Check if donation processed with error
        if (response.donation.errorMessage) {
          if (!isSilent) {
            this.props.analyticsService.trackComponentEvent(this, 'donation-error', {label: response.donation.errorCode});
            
            alert(response.donation.errorMessage);
          }
        } else {
          // Update info about message to find out txID
          this.retrieveMessageInfo().then((message: Message) => {
            // Track successful donation
            if (!isSilent) {
              this.props.analyticsService.trackComponentEvent(this, 'donation-success', {label: message.blockchainTxId});
            }
          });
        }
      } else {
        if (!isSilent) {
          this.props.analyticsService.trackComponentEvent(this, 'donation-success');
          
          alert(`Hmm, can't find your donation. Check if email is correct (should be your PayPal email used for donation).`);
        }
      }
    }, (e) => {
      this.setState({isCheckDonationStatusInProgress: false});
      alert(e.message);
    });
  }

  /**
   * Returns donation URL for PayPal
   * @returns {string}
   */
  protected getDonationUrl(): string {
    return `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=bobrosoft@yandex.ru&item_name=bitcoin-message.com&item_number=Cover+transaction+fee&`
      + `currency_code=${this.state.donationCurrency}&amount=${this.state.donationAmount}`;
  }

  protected handleDonateValidationError(error: AppError) {
    alert(error.message);
  }

  protected handleSubmitDonate(email: string) {
    this.props.analyticsService.trackComponentEvent(this, 'donate-btn-click');
    
    this.setState({donorEmail: email}, () => {
      this.checkDonationStatus(true); // that's just in case to save email
    });
    
    // Redirect to PayPal
    window.open(this.getDonationUrl(), '_blank');
  }
  
  protected handleCheckDonationStatusClick() {
    this.props.analyticsService.trackComponentEvent(this, 'check-status-click');
    
    this.checkDonationStatus();
  }
}