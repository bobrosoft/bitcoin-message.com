import * as React from 'react';
import {NewMessage} from '../../components/NewMessage/NewMessage';
import {sharedConfig} from '../../shared/shared-config';

export class HomePage extends React.Component {
  render() {
    return (
      <section>
        <div className="section-content">
          <NewMessage maxLengthBytes={sharedConfig.maxMessageLengthInBytes}/>
        </div>
      </section>
    );
  }
}