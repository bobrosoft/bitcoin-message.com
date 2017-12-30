import * as React from 'react';
import {MessagePage} from './MessagePage';
import {MessagesStore} from '../../stores/messages.store';
import {match} from 'react-router';
import {shallow} from 'enzyme';
import {Message} from '../../models/shared/message.model';
import {CheckDonationsFunctionResponse} from '../../models/shared/check-donations-function-response.model';
import {CheckDonationsFunctionPayload} from '../../models/shared/check-donations-function-payload.model';
import {SpinnerStore} from '../../stores/spinner.store';
import {AnalyticsService} from '../../stores/analytics.service';

it('renders without crashing', () => {
  shallow(<MessagePage match={{} as match<{id: string}>} messagesStore={stubMessagesStore()} spinnerStore={new SpinnerStore()} analyticsService={stubAnalyticsService()}/>);
});

function stubMessagesStore(): MessagesStore {
  class Stub {
    getMessageById(id: string): Promise<Message> {
      return Promise.resolve({
        message: 'message',
      } as Message);
    }

    checkMessageStatus(payload: CheckDonationsFunctionPayload): Promise<CheckDonationsFunctionResponse> {
      return Promise.resolve({
        
      } as CheckDonationsFunctionResponse);
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