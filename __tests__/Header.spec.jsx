
import React from 'react';
import { mount } from 'enzyme';
import { PrintHeader } from '../src';

const Header = PrintHeader.wrappedComponent;
const printable = {
  setHeader: jest.fn(),
  clearHeader: jest.fn(),
};

const render = (props = {}) => mount(
  <Header {...props} printable={printable} />,
  { attachTo: document.body }
);

describe('Header test', () => {
  let header;

  beforeEach(() => {
    jest.clearAllMocks();
    header = render();
  });

  afterEach(() => {
    try {
      header.unmount();
    } catch (e) { /* already unmounted */ }
  });

  it('will register upon mount', () => {
    expect(printable.setHeader).toHaveBeenCalledTimes(1);
    expect(printable.setHeader.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it('will clear before unmount', () => {
    header.unmount();
    expect(printable.clearHeader).toHaveBeenCalledTimes(1);
  });

  it('all attributes will be passed to the wrapper div', () => {
    header = header
      .setProps({ className: 'customClass', tabIndex: 5, 'aria-label': 'printable' })
      .update();

    const div = header.getDOMNode();
    expect(div.tagName).toEqual('DIV');
    expect(div.attributes['aria-hidden'].value).toEqual('true');
    expect(div.attributes['aria-disabled'].value).toEqual('true');
    expect(div.style.display).toEqual('');
  });
});
