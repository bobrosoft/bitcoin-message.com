import * as React from 'react';
import {App} from './App';
import {shallow} from 'enzyme';

it('renders without crashing', () => {
  shallow(<App messagesStore={{} as any} spinnerStore={{} as any} analyticsService={{} as any} />);
});
