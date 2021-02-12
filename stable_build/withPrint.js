'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
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


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _PrintableContext = require('./PrintableContext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withPrint = function withPrint(Component) {
  var Wrapper = function Wrapper(props) {
    return _react2.default.createElement(
      _PrintableContext.Consumer,
      null,
      function (context) {
        if (!context) {
          throw new Error('withPrint can only be used within a printable context');
        }
        return (0, _react.createElement)(Component, _extends({}, props, { printable: context }));
      }
    );
  };

  Wrapper.wrappedComponent = Component;
  var componentDisplayName = (0, _get2.default)(Component, 'displayName', Component.name);
  Wrapper.displayName = 'withPrint(' + componentDisplayName + ')';
  return Wrapper;
};

exports.default = withPrint;
module.exports = exports['default'];