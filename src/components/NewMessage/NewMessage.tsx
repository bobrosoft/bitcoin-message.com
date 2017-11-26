import * as React from 'react';
import {ChangeEvent, MouseEvent} from 'react';
import './NewMessage.css';
import {AppError} from '../../models/app-error.model';

interface Props {
  maxLengthBytes: number;
  onSend: (message: string) => void;
  onValidationError?: (error: AppError) => void;
}

interface State {
  message: string;
}

export class NewMessage extends React.Component<Props, State> {

  get messageLength(): number {
    return new Blob([this.state.message]).size;
  }
  
  get isMessageTooLong(): boolean {
    return this.messageLength > this.props.maxLengthBytes;
  }
  
  constructor(props: Props) {
    super(props);
    this.state = {message: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div className="NewMessage">
        <div className="message">
          <textarea value={this.state.message} onChange={this.handleChange} rows={2} />
          <div className={'indicator text-right text-88 ' + (this.isMessageTooLong ? 'text-error' : 'text-misc')}>
            {this.messageLength} / {this.props.maxLengthBytes}
          </div>
        </div>
        <div className="buttons">
          <button className="primary full-width spec-send" onClick={this.handleSubmit}>Send</button>
        </div>
        <div>{this.state.message}</div>
      </div>
    );
  }

  protected validate(): AppError | true {
    if (this.isMessageTooLong) {
      return new AppError(`Message is too long (max: ${this.props.maxLengthBytes} bytes)`, 'MESSAGE_TOO_LONG');
    }

    return true;
  }

  protected handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({message: event.target.value});
  }

  protected handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    const validationResult = this.validate();

    if (validationResult === true) {
      this.props.onSend(this.state.message);
    } else {
      if (this.props.onValidationError) {
        this.props.onValidationError(validationResult);
      }
    }
  }
}