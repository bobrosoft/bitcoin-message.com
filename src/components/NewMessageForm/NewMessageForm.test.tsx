import * as React from 'react';
import {NewMessageForm} from './NewMessageForm';
import {shallow} from 'enzyme';
import createSpy = jasmine.createSpy;

it('renders without crashing', () => {
  shallow(<NewMessageForm maxLengthBytes={80} onSend={() => {}} />);
});

it('should properly count message length in bytes', () => {
  const component = shallow(<NewMessageForm maxLengthBytes={80} onSend={() => {}} />);
  const componentInstance = component.instance() as NewMessageForm;
  
  component.find('textarea').simulate('change', {target: {value: 'Hello'}});
  expect(componentInstance.messageLength).toBe(5);

  component.find('textarea').simulate('change', {target: {value: 'тест'}});
  expect(componentInstance.messageLength).toBe(8);

  component.find('textarea').simulate('change', {target: {value: 'тест🐱'}});
  expect(componentInstance.messageLength).toBe(12);
});

it('should detect if message too short', () => {
  const component = shallow(<NewMessageForm maxLengthBytes={8} onSend={() => {}} />);
  const componentInstance = component.instance() as NewMessageForm;

  component.find('textarea').simulate('change', {target: {value: ''}});
  expect(componentInstance.isMessageTooShort).toBe(true);

  component.find('textarea').simulate('change', {target: {value: 'Hello'}});
  expect(componentInstance.isMessageTooLong).toBe(false);
});

it('should detect if message too long', () => {
  const component = shallow(<NewMessageForm maxLengthBytes={8} onSend={() => {}} />);
  const componentInstance = component.instance() as NewMessageForm;

  component.find('textarea').simulate('change', {target: {value: 'Hello'}});
  expect(componentInstance.isMessageTooLong).toBe(false);

  component.find('textarea').simulate('change', {target: {value: 'Hello Hello'}});
  expect(componentInstance.isMessageTooLong).toBe(true);
});

it('should emit onSend event with proper data', () => {
  const spy = createSpy('callback').and.stub();
  const component = shallow(<NewMessageForm maxLengthBytes={8} onSend={spy} />);

  component.find('textarea').simulate('change', {target: {value: 'Hello'}});
  component.find('.spec-send').simulate('click');
  
  expect(spy).toHaveBeenCalledWith('Hello');
});

it('should properly validate message input', () => {
  const submitSpy = createSpy('submitSpy').and.stub();
  const validateSpy = createSpy('validateSpy').and.stub();
  const component = shallow(<NewMessageForm maxLengthBytes={8} onSend={submitSpy} onValidationError={validateSpy} />);

  component.find('textarea').simulate('change', {target: {value: ''}});
  component.find('.spec-send').simulate('click');
  
  component.find('textarea').simulate('change', {target: {value: 'Hello Hello'}});
  component.find('.spec-send').simulate('click');

  component.find('textarea').simulate('change', {target: {value: 'Hello'}});
  component.find('.spec-send').simulate('click');

  expect(validateSpy).toHaveBeenCalledTimes(2);
  expect(submitSpy).toHaveBeenCalledTimes(1);
});