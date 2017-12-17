import * as React from 'react';
import './Spinner.css';
import {inject, observer} from 'mobx-react';
import {SpinnerStore} from '../../stores/spinner.store';

interface Props {
  spinnerStore?: SpinnerStore;
}

@inject('spinnerStore') @observer
export class Spinner extends React.Component<Props> {
  render() {
    return (
      <div className={'Spinner' + (this.props.spinnerStore!.isShown ? '' : ' hidden')}>
        <div className="spinner" />
      </div>
    );
  }
}