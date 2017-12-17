import * as React from 'react';
import {Spinner} from './Spinner';
import {mount, shallow} from 'enzyme';
import {SpinnerStore} from '../../stores/spinner.store';

it('renders without crashing', () => {
  shallow(<Spinner spinnerStore={new SpinnerStore()} />);
});

it('should be shown on SpinnerStore.show', () => {
  const spinnerStore = new SpinnerStore();
  const component = mount(<Spinner spinnerStore={spinnerStore} />);

  expect(component.find('.Spinner').hasClass('hidden')).toBe(true);

  spinnerStore.setShownState(true);
  component.update();
  expect(component.find('.Spinner').hasClass('hidden')).toBe(false);
});