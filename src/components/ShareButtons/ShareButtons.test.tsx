import * as React from 'react';
import {shallow} from 'enzyme';
import {ShareButtons} from './ShareButtons';

it('renders without crashing', () => {
  shallow(<ShareButtons />);
});
