import * as React from 'react';
import {inject} from 'mobx-react';
import {AnalyticsService} from '../../stores/analytics.service';

interface Props {
  analyticsService: AnalyticsService;
}

@inject('analyticsService')
export class TrackPageview extends React.Component<Props> {
  render() {
    // Track pageview
    this.props.analyticsService.trackPage();
    
    return '';
  }
}