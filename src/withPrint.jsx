/**
 * @author Dayan Moreno
 * @fileOverview HOC that passes the PrintArea context as props
 * @module react-printable-area/withPrint
 * @requires React
 *
 * @param {Component} children - React Component to which the props will be injected
 * @returns React Component
 *
 * @example
 * import withPrint from 'react-printable-area/withPrint';
 *
 * withPrint(Component);
 */
import React, { createElement } from 'react';
import get from 'lodash/get';
import { Consumer } from './PrintableContext';

const withPrint = (Component) => {
  const Wrapper = props => (
    <Consumer>
      {
        (context) => {
          if (!context) {
            throw new Error('withPrint can only be used within a printable context');
          }
          return createElement(Component, { ...props, printable: context });
        }
      }
    </Consumer>
  );

  Wrapper.wrappedComponent = Component;
  const componentDisplayName = get(Component, 'displayName', Component.name);
  Wrapper.displayName = `withPrint(${componentDisplayName})`;
  return Wrapper;
};


export default withPrint;
