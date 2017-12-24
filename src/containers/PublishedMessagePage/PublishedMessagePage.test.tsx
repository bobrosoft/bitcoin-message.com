import * as React from 'react';
import {PublishedMessagePage} from './PublishedMessagePage';
import {MessagesStore} from '../../stores/messages.store';
import {PublishedMessage} from '../../shared/api-models/published-message.model';
import {shallow} from 'enzyme';
import {AnalyticsService} from '../../stores/analytics.service';

it('renders without crashing', () => {
  shallow(<PublishedMessagePage match={{params: {id: '1'}} as any} messagesStore={stubMessagesStore()} location={{} as Location} analyticsService={stubAnalyticsService()} />);
});

function stubMessagesStore(): MessagesStore {
  class Stub {
    getPublishedMessageById(id: string): Promise<PublishedMessage> {
      return Promise.resolve({
        message: 'message',
        blockchainTxId: 'blockchainTxId'
      } as PublishedMessage);
    }
  }
  
  return new Stub() as any;
}

function stubAnalyticsService(): AnalyticsService {
  class Stub {
    trackComponentEvent() {

    }
  }

  return new Stub() as any;
}