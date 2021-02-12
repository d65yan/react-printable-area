'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printableShape = exports.Provider = exports.Consumer = undefined;

var _react = require('react');

var _propTypes = require('prop-types');

var _createContext = (0, _react.createContext)(),
    Consumer = _createContext.Consumer,
    Provider = _createContext.Provider;

exports.Consumer = Consumer;
exports.Provider = Provider;
var printableShape = exports.printableShape = (0, _propTypes.shape)({
  clearHeader: _propTypes.func,
  getIsSectionRegistered: _propTypes.func,
  maxDelay: _propTypes.number,
  print: _propTypes.func,
  register: _propTypes.func,
  deregsiter: _propTypes.func,
  setHeader: _propTypes.func,
  title: _propTypes.string
});