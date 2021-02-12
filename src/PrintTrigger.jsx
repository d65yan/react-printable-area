import { cloneElement, PureComponent } from 'react';
import { string, element } from 'prop-types';
import curry from 'lodash/curry';
import curryRight from 'lodash/curryRight';
import map from 'lodash/map';
import toPairs from 'lodash/toPairs';
import fromPairs from 'lodash/fromPairs';
import stubTrue from 'lodash/stubTrue';
import isFunction from 'lodash/isFunction';
import flowRight from 'lodash/flowRight';
import filter from 'lodash/filter';
import constant from 'lodash/constant';
import cond from 'lodash/cond';
import noop from 'lodash/noop';
import withPrint from './withPrint';

const wrappedEvent = (handler, print) => (event) => {
  const result = handler(event);
  const isPromise = result instanceof Promise;
  const isFalse = result === false;
  const next = cond(
    [
      [constant(isPromise), constant(result)],
      [constant(isFalse), () => Promise.reject(new Error(false))],
      [stubTrue, constant(Promise.resolve(result))],
    ]
  )();

  event.preventDefault();
  return next.then(print).catch(noop);
};

// eslint-disable-next-line unicorn/explicit-length-check
const complement = (duples, defaultDuple) => (duples.length ? duples : [defaultDuple]);

const hooksPipeline = curry((print, defaultHook, props) => {
  const handlers = flowRight(
    fromPairs,
    curryRight(map)(([k, v]) => [k, wrappedEvent(v, print)]),
    curryRight(complement)([defaultHook, stubTrue]),
    curryRight(filter)(duple => isFunction(duple[1])),
    toPairs
  )(props);
  return handlers;
});

class PrintTrigger extends PureComponent {
  static propTypes = {
    /**
    * @ignore
    * */
    printable: string.isRequired,
    /**
    * Element to be used to trigger the print function
    * */
    children: element.isRequired,
    /**
    * Name of the event to connect the trigger to
    * */
    hook: string,
  };

  static defaultProps = {
    hook: 'onClick',
  };

  render() {
    // eslint-disable-next-line object-curly-newline
    const { children, hook, printable, ...props } = this.props;

    return cloneElement(
      children,
      {
        ...props,
        ...hooksPipeline(printable.print, hook, props),
      }
    );
  }
}

export default withPrint(PrintTrigger);
