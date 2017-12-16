import * as React from 'react';
import {Message} from './Message';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import {shallow} from 'enzyme';

it('renders without crashing', () => {
  shallow(<Message message={{} as PublishedMessage} />);
});

it('should display message', () => {
  const date = new Date();

  const component = shallow(<Message message={{
    blockchainTxId: 'blockchainTxId',
    message: 'message',
    createdTimestamp: date.getTime()
  } as PublishedMessage} />);

  expect(component.find('.body').text()).toBe('message');
  expect(component.find('.date').text()).toMatch(date.getDate() + '');
  expect(component.find('.spec-txid').text()).toBe('blockchainTxId');
});

it('should not display blockchainTxId if it\'s empty', () => {
  const date = new Date();

  const component = shallow(<Message message={{
    blockchainTxId: '',
    message: 'message',
    createdTimestamp: date.getTime()
  } as PublishedMessage} />);

  expect(component.find('.spec-txid').exists()).toBe(false);
});

it(`should not display <a> tag if noATag passed`, () => {
  const date = new Date();

  const component = shallow(<Message message={{
    blockchainTxId: 'blockchainTxId',
    message: 'message',
    createdTimestamp: date.getTime()
  } as PublishedMessage} />);

  expect(component.find('a.link').exists()).toBe(true);

  const component2 = shallow(<Message message={{
    blockchainTxId: 'blockchainTxId',
    message: 'message',
    createdTimestamp: date.getTime()
  } as PublishedMessage} noATag={true} />);

  expect(component2.find('a.link').exists()).toBe(false);
});