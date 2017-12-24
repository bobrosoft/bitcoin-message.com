import * as React from 'react';
import './Message.css';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import {MouseEvent} from 'react';
import {inject} from 'mobx-react';
import {AnalyticsService} from '../../stores/analytics.service';

interface Props {
  message: PublishedMessage;
  noATag?: boolean;
  analyticsService?: AnalyticsService;
}

@inject('analyticsService')
export class Message extends React.Component<Props> {
  
  constructor(props: Props) {
    super(props);

    this.handleProofLinkClick = this.handleProofLinkClick.bind(this);
    this.handleSubstitutionProofLinkClick = this.handleSubstitutionProofLinkClick.bind(this);
  }
  
  get date() {
    if (Date.prototype.toLocaleDateString) {
      return new Date(this.props.message.createdTimestamp).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    } else {
      return new Date(this.props.message.createdTimestamp).toString();
    }
  }
  
  get externalBlockchainUrl(): string {
    return `https://www.blocktrail.com/BTC/tx/${this.props.message.blockchainTxId}#tx_messages`;
  }
  
  render() {
    return (
      <div className="Message">
        <div className="date text-88 text-secondary">{this.date}</div>
        <div className="body">{this.props.message.message}</div>
        {this.props.message.blockchainTxId &&
        <div className="txid text-66 text-misc">
          <abbr title="Bitcoin Transaction ID">Proof</abbr>:&nbsp;
          {this.props.noATag ?
            <span className="text-misc link" onClick={this.handleSubstitutionProofLinkClick}>
              <span className="spec-txid">{this.props.message.blockchainTxId}</span><i className="fa fa-external-link"/>
            </span>
            :
            <a href={this.externalBlockchainUrl} className="text-misc link" target="_blank" onClick={this.handleProofLinkClick}>
              <span className="spec-txid">{this.props.message.blockchainTxId}</span><i className="fa fa-external-link"/>
            </a>
          }
        </div>
        }
      </div>
    );
  }
  
  protected handleProofLinkClick(e: MouseEvent<HTMLElement>) {
    if (this.props.analyticsService) {
      this.props.analyticsService.trackComponentEvent(this, 'proof-link-click', {label: this.props.message.blockchainTxId});
    }
  }
  
  protected handleSubstitutionProofLinkClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (this.props.analyticsService) {
      this.props.analyticsService.trackComponentEvent(this, 'proof-link-click', {label: this.props.message.blockchainTxId});
    }
    
    window.open(this.externalBlockchainUrl, '_blank');
  }
}