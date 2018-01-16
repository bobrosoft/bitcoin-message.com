import * as React from 'react';
import {LocalSpinner} from './LocalSpinner';
import {shallow} from 'enzyme';

it('renders without crashing', () => {
  shallow(<LocalSpinner />);
});
