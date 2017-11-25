import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HomePage} from './HomePage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HomePage />, div);
});
