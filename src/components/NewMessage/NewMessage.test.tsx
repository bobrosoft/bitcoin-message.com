import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NewMessage} from './NewMessage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewMessage maxLengthBytes={80} />, div);
});
