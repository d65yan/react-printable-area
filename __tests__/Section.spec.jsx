
import React from 'react';
import { mount, shallow } from 'enzyme';
import { PrintSection } from '../src';
import { Provider } from '../src/PrintableContext';

const Section = PrintSection.wrappedComponent.wrappedComponent;
const printable = {
  register: jest.fn(),
  deregister: jest.fn(),
};

const registry = {
  register: jest.fn(),
  deregister: jest.fn(),
  getHtml: jest.fn(),
  setRef: jest.fn(),
};

const render = (props = {}) => mount(
  <Section {...props} printable={printable} registry={registry} />,
  { attachTo: document.body }
);

const shallowRender = (props = {}) => shallow(
  <Section {...props} printable={printable} registry={registry} />,
  { attachTo: document.body }
);

describe('Section test', () => {
  let section;

  beforeEach(() => {
    jest.clearAllMocks();
    section = render();
  });

  afterEach(() => {
    try {
      section.unmount();
    } catch (e) { /* already unmounted */ }
  });

  it('will register upon mount', () => {
    expect(printable.register).toHaveBeenCalledTimes(1);
    expect(printable.register).toHaveBeenCalledWith(registry.getHtml, 0);
  });

  it('will register `div` reference', () => {
    expect(registry.setRef).toHaveBeenCalledTimes(1);
    expect(registry.setRef).toHaveBeenCalledWith(section.find('div').first().getDOMNode());
  });

  it('will deregister before unmount', () => {
    const htmlGetter = printable.register.mock.calls[0][0];
    section.unmount();
    expect(printable.deregister).toHaveBeenCalledTimes(1);
    expect(printable.deregister).toHaveBeenCalledWith(htmlGetter);
  });

  it('all attributes will be passed to the wrapper div', () => {
    section = section
      .setProps({ className: 'customClass', tabIndex: 5, 'aria-label': 'printable' })
      .update();

    const div = section.getDOMNode();
    expect(div.tagName).toEqual('DIV');
    expect(div.className).toEqual('customClass');
    expect(div.tabIndex).toEqual(5);
    expect(div.attributes['aria-label'].value).toEqual('printable');
  });

  it('sets the context provider for print registry childern', () => {
    const shallowSection = shallowRender();
    const provider = shallowSection.find(Provider);
    expect(provider.prop('value')).toEqual({ ...printable, ...registry });
  });

  //
  // it('when no child sections are registered outterHTML will be returned by getHtml', () => {
  //   section = section
  //     .setProps({
  //       children: (<div className="internal-div">this is the content</div>),
  //     })
  //     .update();
  //
  //   expect(section.instance().getHtml()).toEqual(
  //     '<div><div class="internal-div">this is the content</div></div>'
  //   );
  // });
});
