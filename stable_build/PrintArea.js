'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _printRegistry = require('./printRegistry');

var _printRegistry2 = _interopRequireDefault(_printRegistry);

var _PrintableContext = require('./PrintableContext');

var _styleSheet = require('./styleSheet');

var _styleSheet2 = _interopRequireDefault(_styleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-unused-state: 0 */
/**
 * @author Dayan Moreno
 * @fileOverview This component marks an area from which content can be printed
 * @module react-printable-area/PrintArea
 * @requires React
 *
 * @param {string} title - Page title to used on printed document
 * @param {number} maxDelay - max time to way before calling print. In a case where waiting for
 * fonts and images take too long to load and waiting too long is not an option this value can be
 * set to trigger at that time no matter what.
 * @returns React Component
 *
 * @example
 * import PrintArea from 'react-printable-area/PrintArea';
 * import PrintSection from 'react-printable-area/PrintSection';
 * import PrintTrigger from 'react-printable-area/PrintTrigger';
 *
 * // in your render
 * <PrintArea>
 *   not printable content
 *   <PrintSection>
 *     printable content
 *   </PrintSection>
 *   <PrintTrigger><button>Print</button></PrintTrigger>
 * </PrintArea>
 *
 * @note
 * This component only controls printable content when PrintTrigger is used. If the browser's print
 * button is used all the print visible content of the page will be printed
 */

var PrintArea = function (_Component) {
  _inherits(PrintArea, _Component);

  function PrintArea(props) {
    _classCallCheck(this, PrintArea);

    var _this = _possibleConstructorReturn(this, (PrintArea.__proto__ || Object.getPrototypeOf(PrintArea)).call(this, props));

    _initialiseProps.call(_this);

    var _this$props = _this.props,
        _this$props$registry = _this$props.registry,
        getHtml = _this$props$registry.getHtml,
        setRef = _this$props$registry.setRef,
        registry = _objectWithoutProperties(_this$props$registry, ['getHtml', 'setRef']),
        title = _this$props.title,
        maxDelay = _this$props.maxDelay;

    _this.state = _extends({
      print: _this.print.bind(_this),
      setHeader: _this.setHeader.bind(_this),
      clearHeader: _this.clearHeader.bind(_this),
      title: title,
      maxDelay: maxDelay
    }, registry);
    return _this;
  }

  _createClass(PrintArea, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var media = window.matchMedia('print');
      if (media.addEventListener) {
        media.addEventListener('change', this.mediaChangeHandler);
      } else {
        media.addListener(this.mediaChangeHandler);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var media = window.matchMedia('print');
      if (media.addEventListener) {
        media.removeEventListener('change', this.mediaChangeHandler);
      } else {
        media.removeListener(this.mediaChangeHandler);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          attrs = _objectWithoutProperties(_props, ['children']);

      return _react2.default.createElement(
        _PrintableContext.Provider,
        { value: this.state },
        _react2.default.createElement(
          'div',
          attrs,
          children
        )
      );
    }
  }]);

  return PrintArea;
}(_react.Component);

PrintArea.propTypes = {
  /**
   * Content to be rendered  when the associated trigger is actioned
   * */
  children: _propTypes.node.isRequired,
  /**
  * Maximum time to wait for all the resources to be loaded before print is initiated
  * */
  maxDelay: _propTypes.number,
  /**
  * Document title while printing
  * */
  title: _propTypes.string,
  /**
  * className passed to the div element that wraps the content to print
  * */
  className: _propTypes.string,

  /**
  * className passed to the table that conforms the document to be printed
  * */
  printClassName: _propTypes.string,
  /**
  * @ignore
  * */
  registry: _printRegistry.registryShape.isRequired
};
PrintArea.defaultProps = {
  title: '',
  maxDelay: 1000,
  className: '',
  printClassName: ''
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.header = undefined;

  this.mediaChangeHandler = function (event) {
    if (event.media === 'print' && !event.matches && _this2.scrollX !== undefined) {
      document.body.removeChild(_this2.table);
      document.body.removeChild(_this2.style);
      document.title = _this2.realTitle;
      (function (x, y) {
        setTimeout(function () {
          return window.scrollTo(x, y);
        }, 100);
      })(_this2.scrollX, _this2.scrollY);
      _this2.scrollX = undefined;
      _this2.scrollY = undefined;
      _this2.table = undefined;
      _this2.style = undefined;
      _this2.realTitle = undefined;
    }
  };

  this.getHtml = function (className) {
    var _props2 = _this2.props,
        registry = _props2.registry,
        printClassName = _props2.printClassName,
        areaClass = _props2.className;

    var sectionsHtml = '\n        <table class="' + (0, _classnames2.default)(className, printClassName) + '">\n          <thead>\n            <tr>\n              <td>\n                ' + (_this2.header && _this2.header.innerHTML || '') + '\n              </td>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>\n                <div class="' + areaClass + '">\n                  ' + registry.getHtml() + '\n                </div>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n    ';

    return sectionsHtml;
  };

  this.setHeader = function (header) {
    // istanbul ignore else
    if (header) {
      _this2.header = header;
    }
  };

  this.clearHeader = function () {
    _this2.header = undefined;
  };

  this.print = function () {
    var returnPromise = void 0;
    try {
      var frame = document.createElement('div');
      var className = 'print-only-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
      var cssContent = (0, _styleSheet2.default)(className);

      frame.innerHTML = '' + cssContent + _this2.getHtml(className);

      _this2.scrollY = window.pageYOffset || document.documentElement.scrollTop;
      _this2.scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      // eslint-disable-next-line prefer-destructuring
      _this2.table = frame.getElementsByTagName('table')[0];
      // eslint-disable-next-line prefer-destructuring
      _this2.style = frame.getElementsByTagName('style')[0];
      document.body.appendChild(_this2.table);
      document.body.appendChild(_this2.style);
      var images = _this2.table.getElementsByTagName('img');

      var timeout = new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve('print by timeout');
        }, _this2.props.maxDelay);
      } // eslint-disable-line react/destructuring-assignment
      );

      var delay = new Promise(function (resolve) {
        return setTimeout(function () {
          resolve();
        }, 300);
      });

      var loaded = [document.fonts && document.fonts.ready, delay];

      Array.prototype.forEach.call(images, function (img) {
        var promise = img.complete ? Promise.resolve(true) : new Promise(function (resolve) {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });

        loaded.push(promise);
      });

      var print = function print(reason) {
        _this2.realTitle = document.title;
        // eslint-disable-next-line react/destructuring-assignment
        document.title = _this2.props.title || _this2.realTitle;
        window.print();
        return reason;
      };

      var successPrint = Promise.all(loaded).then(function () {
        return 'print by success';
      });

      returnPromise = Promise.race([successPrint, timeout]).then(print).catch(print);
    } catch (notSupported) {
      _this2.table = undefined;
      _this2.style = undefined;
      _this2.realTitle = undefined;
      // istanbul ignore next line
      if (_this2.scrollX !== undefined) {
        window.scrollTo(_this2.scrollX, _this2.scrollY);
      }
      _this2.scrollX = undefined;
      _this2.scrollY = undefined;
      returnPromise = Promise.reject(new Error('could not print'));
    }

    return returnPromise;
  };
};

exports.default = (0, _printRegistry2.default)(PrintArea);
module.exports = exports['default'];