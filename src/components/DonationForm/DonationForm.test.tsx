import * as React from 'react';
import {DonationForm} from './DonationForm';
import {shallow} from 'enzyme';
import createSpy = jasmine.createSpy;

it('renders without crashing', () => {
  shallow(<DonationForm donationAmount={1.2} donationCurrency={'USD'} onSubmit={() => {}} />);
});

it('should properly display currency symbol', () => {
  const component = shallow(<DonationForm donationAmount={1.2} donationCurrency={'USD'} onSubmit={() => {}} />);

  expect(component.find('.spec-send').text()).toMatch('$');
});

it('should validate email input', () => {
  const submitSpy = createSpy('submitSpy').and.stub();
  const validateSpy = createSpy('validateSpy').and.stub();
  const component = shallow(<DonationForm donationAmount={1.2} donationCurrency={'USD'} onSubmit={submitSpy} onValidationError={validateSpy} />);

  component.find('.email input').simulate('change', {target: {value: 'Hello'}});
  component.find('.spec-send').simulate('click');

  component.find('.email input').simulate('change', {target: {value: 'Hello@'}});
  component.find('.spec-send').simulate('click');

  component.find('.email input').simulate('change', {target: {value: 'Hello@asdsadsad'}});
  component.find('.spec-send').simulate('click');

  component.find('.email input').simulate('change', {target: {value: 'Hello@asdsadsad.ru'}});
  component.find('.spec-send').simulate('click');
  
  expect(submitSpy).toHaveBeenCalledTimes(1);
  expect(validateSpy).toHaveBeenCalledTimes(3);
});