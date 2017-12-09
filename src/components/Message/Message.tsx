import * as React from 'react';
import './Message.css';
import {PublishedMessage} from '../../shared/api-models/published-message.model';

interface Props {
  message: PublishedMessage;
}

export class Message extends React.Component<Props> {
  
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
        <div className="txid text-66 text-misc">
          <abbr title="Bitcoin Transaction ID">Proof</abbr>:&nbsp;
          <a href={this.externalBlockchainUrl} className="text-misc" target="_blank">
            <span className="spec-txid">{this.props.message.blockchainTxId}</span><i className="fa fa-external-link" />
          </a>
        </div>
      </div>
    );
  }
}