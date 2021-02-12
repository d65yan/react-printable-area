import React from 'react';
import { mount } from 'enzyme';
import noop from 'lodash/noop';
import stubFalse from 'lodash/stubFalse';
import { PrintTrigger } from '../src';

const Trigger = PrintTrigger.wrappedComponent;
const printable = {
  print: jest.fn(),
};

const render = (props = {}) => mount(
  <Trigger {...props} printable={printable}>
    <button type="button" />
  </Trigger>
);

const fakeEvent = {
  preventDefault: jest.fn(),
};

describe('Trigger test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listens to click events by default', () => {
    const button = render().find('button');
    expect(button).toHaveLength(1);
    return button.prop('onClick')(fakeEvent)
      .then(() => {
        expect(printable.print).toHaveBeenCalledTimes(1);
      });
  });

  it('the event to listen can be changed', () => {
    const button = render({ hook: 'onKeyPress' }).find('button');

    expect(button.prop('onClick')).toEqual(undefined);

    return button.prop('onKeyPress')(fakeEvent)
      .then(() => {
        expect(printable.print).toHaveBeenCalledTimes(1);
      });
  });

  it('will listen for attached events if provided', () => {
    const button = render({ onClick: noop, onKeyDown: noop }).find('button');

    expect(button.prop('onClick')).toEqual(expect.any(Function));
    expect(button.prop('onClick')).not.toEqual(noop);

    expect(button.prop('onKeyDown')).toEqual(expect.any(Function));
    expect(button.prop('onKeyDown')).not.toEqual(noop);


    return Promise.all([button.prop('onClick')(fakeEvent), button.prop('onKeyDown')(fakeEvent)])
      .then(() => { expect(printable.print).toHaveBeenCalledTimes(2); });
  });

  it('if a provided handler returns false the print operation will be cancelled', () => {
    const button = render({ onClick: stubFalse }).find('button');

    return button.prop('onClick')(fakeEvent)
      .catch(() => { expect(printable.print).toHaveBeenCalledTimes(0); });
  });

  it('if a provided handler returns a rejected promise the print will be cancelled ', () => {
    const button = render({ onClick: () => Promise.reject(new Error('reason')) }).find('button');

    return button.prop('onClick')(fakeEvent)
      .catch(() => { expect(printable.print).toHaveBeenCalledTimes(0); });
  });
});
