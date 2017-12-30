import * as React from 'react';
import {PublishedMessages} from './PublishedMessages';
import {shallow} from 'enzyme';
import {MessagesStore} from '../../stores/messages.store';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import createSpy = jasmine.createSpy;
import {BlockchainNetwork} from '../../shared/api-models/blockchain-network.model';

it('renders without crashing', () => {
  shallow(<PublishedMessages itemsPerPortion={15} messagesStore={mockMessagesStore()} />);
});

it('should render messages', async () => {
  const component = await shallow(<PublishedMessages itemsPerPortion={15} messagesStore={mockMessagesStore()} />);

  component.update();
  expect(component.find('.item').length).toBe(3);
});

it('should render proper number of messages based on itemsPerPortion', async () => {
  const component = await shallow(<PublishedMessages itemsPerPortion={2} messagesStore={mockMessagesStore()} />);
  
  component.update();
  expect(component.find('.item').length).toBe(2);
});

it('should load next portion on "Load more" button click', async () => {
  const component = await shallow(<PublishedMessages itemsPerPortion={2} messagesStore={mockMessagesStore()}/>);

  component.update();
  expect(component.find('.item').length).toBe(2);

  await component.find('.spec-more-btn').simulate('click');

  component.update();
  expect(component.find('.item').length).toBe(3);
});

it('should emit onMessageClick', async () => {
  const onMessageClickSpy = createSpy('onMessageClick').and.stub();
  const component = await shallow(<PublishedMessages itemsPerPortion={15} messagesStore={mockMessagesStore()} onMessageClick={onMessageClickSpy} />);

  component.update();
  component.find('.item').at(0).simulate('click');
  
  expect(onMessageClickSpy).toHaveBeenCalled();
  expect(onMessageClickSpy).toHaveBeenCalledWith(component.state().messages[0]);
});

it('should hide "Load more" button if there\'s no more elements to show', async () => {
  const onMessageClickSpy = createSpy('onMessageClick').and.stub();
  const component = await shallow(<PublishedMessages itemsPerPortion={2} messagesStore={mockMessagesStore()} onMessageClick={onMessageClickSpy} />);

  component.update();
  await component.find('.spec-more-btn').at(0).simulate('click');

  component.update();
  expect(component.find('.spec-more-btn').exists()).toBe(false);
});


function mockMessagesStore(): MessagesStore {
  class MockMessagesStore {
    messages = [
      {
        message: 'Test 1',
        blockchainNetwork: BlockchainNetwork.btc,
        blockchainTxId: 'id1',
        createdTimestamp: 1513012883543
      },
      {
        message: 'Test 2',
        blockchainNetwork: BlockchainNetwork.btc,
        blockchainTxId: 'id2',
        createdTimestamp: 1513012883544
      },
      {
        message: 'Test 3',
        blockchainNetwork: BlockchainNetwork.btc,
        blockchainTxId: 'id3',
        createdTimestamp: 1513012883545
      }
    ].reverse();
    
    getRecentPublishedMessages(startFromTimestamp: number = 9999999999999, limit: number = 30): Promise<PublishedMessage[]> {
      let count = 0;
      return Promise.resolve(this.messages.filter((m) => {
        if (m.createdTimestamp > startFromTimestamp) {
          return false;
        }
        
        if (count >= limit) {
          return false;
        }

        count++;
        return true;
      }));
    }
  }

  return new MockMessagesStore() as any;
}