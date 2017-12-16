import * as React from 'react';
import {HomePage} from './HomePage';
import {MessagesStore} from '../../stores/messages.store';
import {shallow} from 'enzyme';

it('renders without crashing', () => {
  shallow(<HomePage messagesStore={{} as MessagesStore} />);
});
