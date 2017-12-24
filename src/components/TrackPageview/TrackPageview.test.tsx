import * as React from 'react';
import {TrackPageview} from './TrackPageview';
import {shallow} from 'enzyme';
import {AnalyticsService} from '../../stores/analytics.service';

it('renders without crashing', () => {
  shallow(<TrackPageview analyticsService={stubAnalyticsService()} />);
});

function stubAnalyticsService(): AnalyticsService {
  class Stub {
    trackPage(path: string = '') {
      
    }
  }

  return new Stub() as any;
}