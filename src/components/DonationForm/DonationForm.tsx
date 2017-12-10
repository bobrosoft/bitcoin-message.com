import * as React from 'react';
import {ChangeEvent, MouseEvent} from 'react';
import './DonationForm.css';
import {AppError} from '../../models/app-error.model';

interface Props {
  donationAmount: number;
  donationCurrency: string;
  onSubmit: (email: string) => void;
  onValidationError?: (error: AppError) => void;
}

interface State {
  email: string;
}

export class DonationForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {email: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  currencyCodeToSymbol(code: string) {
    switch (code) {
      case 'USD':
        return '$';

      default:
        return code + ' ';
    }
  }

  render() {
    return (
      <div className="DonationForm">
        <div className="p email">
          <input placeholder="Donor's email (to find your donation)" value={this.state.email} onChange={this.handleChange} />
        </div>
        <p className="buttons text-center">
          <button className="primary  spec-send" onClick={this.handleSubmit}>
            Donate {this.currencyCodeToSymbol(this.props.donationCurrency)}{this.props.donationAmount.toFixed(2)}
          </button>
        </p>
      </div>
    ); 
  }

  protected validate(): AppError | true {
    if (!this.state.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
      return new AppError('Wrong email format', 'WRONG_EMAIL_FORMAT');
    }

    return true;
  }

  protected handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({email: event.target.value});
  }

  protected handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    const validationResult = this.validate();

    if (validationResult === true) {
      this.props.onSubmit(this.state.email);
    } else {
      if (this.props.onValidationError) {
        this.props.onValidationError(validationResult);
      }
    }
  }
}