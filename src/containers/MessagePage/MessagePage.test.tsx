import * as React from 'react';
import {MessagePage} from './MessagePage';
import {MessagesStore} from '../../stores/messages.store';
import {match} from 'react-router';
import {shallow} from 'enzyme';
import {Message} from '../../shared/api-models/message.model';
import {CheckDonationsFunctionResponse} from '../../shared/api-models/check-donations-function-response.model';
import {CheckDonationsFunctionPayload} from '../../shared/api-models/check-donations-function-payload.model';

it('renders without crashing', () => {
  shallow(<MessagePage match={{} as match<{id: string}>} messagesStore={stubMessagesStore()} />);
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