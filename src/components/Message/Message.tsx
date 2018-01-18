import * as React from 'react';
import './Message.css';
import {PublishedMessage} from '../../models/shared/published-message.model';
import {MouseEvent} from 'react';
import {inject} from 'mobx-react';
import {AnalyticsService} from '../../stores/analytics.service';
import {BlockchainNetwork} from '../../models/shared/blockchain-network.model';

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
  
  get networkName(): string {
    switch (this.props.message.blockchainNetwork) {
      case BlockchainNetwork.btc:
        return 'Bitcoin';

      case BlockchainNetwork.tbtc:
        return 'Bitcoin Testnet';

      case BlockchainNetwork.bch:
        return 'Bitcoin Cash';

      case BlockchainNetwork.tbch:
        return 'Bitcoin Cash Testnet';

      default:
        return 'Unknown';
    }
  }
  
  get externalBlockchainUrl(): string {
    let network: string;
    
    switch (this.props.message.blockchainNetwork) {
      case BlockchainNetwork.btc:
        network = 'BTC';
        break;
        
      case BlockchainNetwork.tbtc:
        network = 'tBTC';
        break;
        
      case BlockchainNetwork.bch:
        network = 'BCC';
        break;
        
      case BlockchainNetwork.tbch:
        network = 'tBCC';
        break;
        
      default:
        break;
    }
    
    return `https://www.blocktrail.com/${network!}/tx/${this.props.message.blockchainTxId}`;
  }
  
  render() {
    return (
      <div className="Message">
        <div className="date text-88 text-secondary">{this.date}</div>
        <div className="body">{this.props.message.message}</div>
        {this.props.message.blockchainTxId &&
        <div className="txid text-66 text-misc">
          <abbr title={`${this.networkName} Transaction ID`}>Proof</abbr>:&nbsp;
          {this.props.noATag ?
            <span className="text-misc link" onClick={this.handleSubstitutionProofLinkClick}>
              <span className="spec-txid">{this.props.message.blockchainTxId}</span><i className="fa fa-external-link"/>
            </span>
            :
            <a href={this.externalBlockchainUrl} className="text-misc link" target="_blank" rel="noopener" onClick={this.handleProofLinkClick}>
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