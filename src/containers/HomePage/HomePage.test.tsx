import * as React from 'react';
import {HomePage} from './HomePage';
import {MessagesStore} from '../../stores/messages.store';
import {shallow} from 'enzyme';
import {SpinnerStore} from '../../stores/spinner.store';
import {AnalyticsService} from '../../stores/analytics.service';

it('renders without crashing', () => {
  shallow(<HomePage messagesStore={{} as MessagesStore} spinnerStore={new SpinnerStore()} analyticsService={stubAnalyticsService()}/>);
});

function stubAnalyticsService(): AnalyticsService {
  class Stub {
    trackComponentEvent() {

    }
  }

  return new Stub() as any;
}