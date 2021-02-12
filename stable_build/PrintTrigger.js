'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _curry = require('lodash/curry');

var _curry2 = _interopRequireDefault(_curry);

var _curryRight = require('lodash/curryRight');

var _curryRight2 = _interopRequireDefault(_curryRight);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _toPairs = require('lodash/toPairs');

var _toPairs2 = _interopRequireDefault(_toPairs);

var _fromPairs = require('lodash/fromPairs');

var _fromPairs2 = _interopRequireDefault(_fromPairs);

var _stubTrue = require('lodash/stubTrue');

var _stubTrue2 = _interopRequireDefault(_stubTrue);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _flowRight = require('lodash/flowRight');

var _flowRight2 = _interopRequireDefault(_flowRight);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _constant = require('lodash/constant');

var _constant2 = _interopRequireDefault(_constant);

var _cond = require('lodash/cond');

var _cond2 = _interopRequireDefault(_cond);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _withPrint = require('./withPrint');

var _withPrint2 = _interopRequireDefault(_withPrint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wrappedEvent = function wrappedEvent(handler, print) {
  return function (event) {
    var result = handler(event);
    var isPromise = result instanceof Promise;
    var isFalse = result === false;
    var next = (0, _cond2.default)([[(0, _constant2.default)(isPromise), (0, _constant2.default)(result)], [(0, _constant2.default)(isFalse), function () {
      return Promise.reject(new Error(false));
    }], [_stubTrue2.default, (0, _constant2.default)(Promise.resolve(result))]])();

    event.preventDefault();
    return next.then(print).catch(_noop2.default);
  };
};

// eslint-disable-next-line unicorn/explicit-length-check
var complement = function complement(duples, defaultDuple) {
  return duples.length ? duples : [defaultDuple];
};

var hooksPipeline = (0, _curry2.default)(function (print, defaultHook, props) {
  var handlers = (0, _flowRight2.default)(_fromPairs2.default, (0, _curryRight2.default)(_map2.default)(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return [k, wrappedEvent(v, print)];
  }), (0, _curryRight2.default)(complement)([defaultHook, _stubTrue2.default]), (0, _curryRight2.default)(_filter2.default)(function (duple) {
    return (0, _isFunction2.default)(duple[1]);
  }), _toPairs2.default)(props);
  return handlers;
});

var PrintTrigger = function (_PureComponent) {
  _inherits(PrintTrigger, _PureComponent);

  function PrintTrigger() {
    _classCallCheck(this, PrintTrigger);

    return _possibleConstructorReturn(this, (PrintTrigger.__proto__ || Object.getPrototypeOf(PrintTrigger)).apply(this, arguments));
  }

  _createClass(PrintTrigger, [{
    key: 'render',
    value: function render() {
      // eslint-disable-next-line object-curly-newline
      var _props = this.props,
          children = _props.children,
          hook = _props.hook,
          printable = _props.printable,
          props = _objectWithoutProperties(_props, ['children', 'hook', 'printable']);

      return (0, _react.cloneElement)(children, _extends({}, props, hooksPipeline(printable.print, hook, props)));
    }
  }]);

  return PrintTrigger;
}(_react.PureComponent);

PrintTrigger.propTypes = {
  /**
  * @ignore
  * */
  printable: _propTypes.string.isRequired,
  /**
  * Element to be used to trigger the print function
  * */
  children: _propTypes.element.isRequired,
  /**
  * Name of the event to connect the trigger to
  * */
  hook: _propTypes.string
};
PrintTrigger.defaultProps = {
  hook: 'onClick'
};
exports.default = (0, _withPrint2.default)(PrintTrigger);
module.exports = exports['default'];