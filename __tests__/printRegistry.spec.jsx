import React from 'react';
import { shallow } from 'enzyme';
import printRegistry from '../src/printRegistry';

const Button = () => <button type="button" />;
const WrappedButton = printRegistry(Button);
const render = (props = {}) => shallow(<WrappedButton {...props} />);
describe('printRegistry', () => {
  it('is a function', () => {
    expect(printRegistry).toEqual(expect.any(Function));
  });

  it('Decorates the passed component', () => {
    expect(WrappedButton.wrappedComponent).toEqual(Button);
    expect(WrappedButton.displayName).toEqual('printRegistry(Button)');
  });

  it('passes the register props to the decorated component', () => {
    const wrappedButton = render();
    const button = wrappedButton.find(Button);
    expect(button.prop('registry')).toBe(wrappedButton.state());
    expect(wrappedButton.state()).toEqual({
      register: expect.any(Function),
      deregister: expect.any(Function),
      getHtml: expect.any(Function),
      setRef: expect.any(Function),
    });
  });

  it('passes the provided props to the decorated component', () => {
    const wrappedButton = render({ key1: 'value1' });
    const button = wrappedButton.find(Button);
    expect(button.prop('key1')).toEqual('value1');
  });

  describe('functionality', () => {
    it('register adds a section to the sections array if it does not exist yet', () => {
      const section1HtmlGetter = () => '1';
      const section2HtmlGetter = () => '2';

      const area = render();
      const instance = area.instance();
      instance.register(section1HtmlGetter, 5);
      instance.register(section2HtmlGetter, 1);
      instance.register(section1HtmlGetter, 0);

      expect(instance.sections).toHaveLength(2);
      expect(instance.sections).toEqual(
        [
          { htmlGetter: section1HtmlGetter, priority: 5 },
          { htmlGetter: section2HtmlGetter, priority: 1 },
        ]
      );
    });

    it('getSectionIndex returns the section index in the register array', () => {
      const section1HtmlGetter = () => '1';
      const section2HtmlGetter = () => '2';

      const area = render();
      const instance = area.instance();
      instance.register(section1HtmlGetter, 0);
      instance.register(section2HtmlGetter, 1);

      expect(instance.getSectionIndex(section2HtmlGetter)).toEqual(1);
    });

    it('getIsSectionRegistered returns true if the section has been registered', () => {
      const section1HtmlGetter = () => '1';
      const section2HtmlGetter = () => '2';

      const area = render();
      const instance = area.instance();
      instance.register(section1HtmlGetter);
      instance.register(section2HtmlGetter);

      expect(instance.getIsSectionRegistered(section2HtmlGetter)).toEqual(true);
    });

    it('deregister removes a section from the sections array if it does exist', () => {
      const section1HtmlGetter = () => '1';
      const section2HtmlGetter = () => '2';
      const section3HtmlGetter = () => '3';
      const section4HtmlGetter = () => '4';

      const area = render();
      const instance = area.instance();
      instance.register(section1HtmlGetter, 5);
      instance.register(section2HtmlGetter, 1);
      instance.register(section3HtmlGetter, 0);

      instance.deregister(section2HtmlGetter);
      expect(() => instance.deregister(section4HtmlGetter)).not.toThrow();
      expect(instance.sections).toHaveLength(2);
      expect(instance.sections).toEqual(
        [
          { htmlGetter: section1HtmlGetter, priority: 5 },
          { htmlGetter: section3HtmlGetter, priority: 0 },
        ]
      );
    });

    it('getRef sets the reference of the printable content', () => {
      const area = render();
      const instance = area.instance();
      instance.setRef('crazy ref');
      expect(instance.printableRef).toEqual('crazy ref');
    });

    describe('getHtml', () => {
      it('when no sections are registered and no ref returns empty string', () => {
        const registry = render();
        const registryProps = registry.find(Button).props().registry;
        expect(registryProps.getHtml()).toEqual('');
      });

      it('when no sections are registered returns outerHtml content of the ref', () => {
        const registry = render();
        const registryProps = registry.find(Button).props().registry;
        registryProps.setRef({ outerHTML: 'some content' });
        expect(registryProps.getHtml()).toEqual('some content');
      });

      it('when there are registered sections a combination of the getHtml will be returned', () => {
        const section1HtmlGetter = () => '<html section1>';
        const section2HtmlGetter = () => '<html section2>';
        const section3HtmlGetter = () => '<html section3>';

        const registry = render();
        const registryProps = registry.find(Button).props().registry;

        registryProps.register(section2HtmlGetter, 1);
        registryProps.register(section3HtmlGetter, 6);
        registryProps.register(section1HtmlGetter, 5);

        expect(registryProps.getHtml()).toMatchSnapshot();
      });

      it('when the registered sections have no priority they are presented as registered', () => {
        const section1HtmlGetter = () => '<html section1>';
        const section2HtmlGetter = () => '<html section2>';
        const section3HtmlGetter = () => '<html section3>';

        const registry = render();
        const registryProps = registry.find(Button).props().registry;

        registryProps.register(section2HtmlGetter);
        registryProps.register(section3HtmlGetter);
        registryProps.register(section1HtmlGetter);

        expect(registryProps.getHtml()).toMatchSnapshot();
      });
    });
  });
});
