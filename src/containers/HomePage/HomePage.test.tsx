import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HomePage} from './HomePage';
import {MessagesStore} from '../../stores/messages.store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HomePage messagesStore={{} as MessagesStore} />, div);
});
