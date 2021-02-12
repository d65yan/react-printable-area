import React from 'react';
import { mount } from 'enzyme';
import { Provider } from '../src/PrintableContext';
import { withPrint } from '../src';

const PureButton = props => <button type="button" {...props} />;
const Button = withPrint(PureButton);

describe('withPrint test', () => {
  it('conserves the wrapped component', () => {
    expect(Button.wrappedComponent).toBe(PureButton);
  });

  it('modifies the displayName', () => {
    expect(Button.displayName).toEqual('withPrint(PureButton)');
  });

  it('Throws an error if used out of context', () => {
    expect(() => mount(<Button />)).toThrow('');
  });

  it('translates context into props', () => {
    const contextValue = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };

    const button = mount(
      <Provider value={contextValue}>
        <Button />
      </Provider>
    ).find('button');

    expect(button).toHaveLength(1);

    expect(button.props()).toEqual({
      printable: contextValue,
      type: 'button',
    });
  });
});
