import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MessagePage} from './MessagePage';
import {MessagesStore} from '../../stores/messages.store';
import {match} from 'react-router';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MessagePage match={{} as match<{id: string}>} messagesStore={{} as MessagesStore} />, div);
});
