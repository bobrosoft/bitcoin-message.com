import * as React from 'react';
import {ChangeEvent, MouseEvent} from 'react';
import './NewMessage.css';

interface Props {
  maxLengthBytes: number;
}

export class NewMessage extends React.Component<Props, {message: string}> {

  get isMessageTooLong(): boolean {
    return new Blob([this.state.message]).size > this.props.maxLengthBytes;
  }
  
  constructor(props: Props) {
    super(props);
    this.state = {message: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    alert('A name was submitted: ' + this.state.message);
    event.preventDefault();
  }
  
  render() {
    return (
      <div className="NewMessage">
        <div className="message">
          <textarea value={this.state.message} onChange={this.handleChange} rows={2} />
          <div className={'indicator text-right text-88 ' + (this.isMessageTooLong ? 'text-error' : 'text-misc')}>
            {this.state.message.length} / {this.props.maxLengthBytes}
          </div>
        </div>
        <div className="buttons">
          <button className="primary full-width" onClick={this.handleSubmit}>Send</button>
        </div>
        <div>{this.state.message}</div>
      </div>
    );
  }
}