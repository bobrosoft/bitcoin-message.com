import * as ReactGA from 'react-ga';
import {Component} from 'react';
import {appConfig} from '../config';

export class AnalyticsService {
  constructor() {
    ReactGA.initialize(appConfig.analytics.ga.trackingId, {titleCase: false});
  }
  
  /**
   * Tracks user passed
   * @param userId
   * @param properties
   */
  trackUser(userId: string, properties: any = {}) {
    ReactGA.set({
      userId: userId
    });
  }

  /**
   * Tracks event passed
   * @param name
   * @param properties
   */
  trackEvent(name: string, properties: any = {}) {
    ReactGA.event({
      action: name,
      ...properties
    });
  }

  /**
   * Tracks page passed
   * @param path
   */
  trackPage(path: string = window.location.pathname + window.location.search) {
    ReactGA.set({page: path});
    ReactGA.pageview(path);
  }

  /**
   * That's a helper method which mostly should be used on pages
   * @param {Component} page
   * @param {string} event
   * @param properties
   */
  trackComponentEvent(page: Component, event: string, properties: any = {}) {
    this.trackEvent(event, {
      category: page.constructor.name.replace('Component', ''),
      ...properties
    });
  }

  /**
   * Tracks transaction
   * @param transaction
   */
  trackTransaction(transaction: AnalyticsTransaction) {
    throw 'Not implemented';
  }
}

export interface AnalyticsTransaction {
  id: string;
  affiliation: string;
  revenue: number;
  shipping?: number;
  tax?: number;
  currency: string;
  card_type?: string;
  items?: Array<{
    id: string;
    name: string;
    category?: string;
    sku?: string;
    price: number;
    currency: string;
    quantity: number;
  }>;
}