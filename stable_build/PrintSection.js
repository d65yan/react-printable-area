'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _printRegistry = require('./printRegistry');

var _printRegistry2 = _interopRequireDefault(_printRegistry);

var _PrintableContext = require('./PrintableContext');

var _withPrint = require('./withPrint');

var _withPrint2 = _interopRequireDefault(_withPrint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PrintSection = function (_Component) {
  _inherits(PrintSection, _Component);

  function PrintSection(props) {
    _classCallCheck(this, PrintSection);

    var _this = _possibleConstructorReturn(this, (PrintSection.__proto__ || Object.getPrototypeOf(PrintSection)).call(this, props));

    _this.setRef = function (section) {
      if (section) {
        var _this$props = _this.props,
            printable = _this$props.printable,
            priority = _this$props.priority,
            _this$props$registry = _this$props.registry,
            getHtml = _this$props$registry.getHtml,
            setRef = _this$props$registry.setRef;

        setRef(section);
        printable.register(getHtml, priority);
      }
    };

    _this.state = _extends({}, props.printable, props.registry);
    return _this;
  }

  _createClass(PrintSection, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.printable.deregister(this.props.registry.getHtml);
    }
  }, {
    key: 'render',
    value: function render() {
      // eslint-disable-next-line object-curly-newline
      var _props = this.props,
          priority = _props.priority,
          registry = _props.registry,
          printable = _props.printable,
          children = _props.children,
          attrs = _objectWithoutProperties(_props, ['priority', 'registry', 'printable', 'children']);

      return _react2.default.createElement(
        _PrintableContext.Provider,
        { value: this.state },
        _react2.default.createElement(
          'div',
          _extends({}, attrs, { ref: this.setRef }),
          children
        )
      );
    }
  }]);

  return PrintSection;
}(_react.Component);

PrintSection.propTypes = {
  /**
   * Value used to sort in decreasing order the Sections to print
  * */
  priority: _propTypes.number,
  /**
   * Content to be used as Printable Area Section.
   */
  children: _propTypes.node.isRequired,
  /**
   * @ignore
   * */
  printable: _PrintableContext.printableShape.isRequired,
  /**
   * @ignore
   * */
  registry: _printRegistry.registryShape.isRequired
};
PrintSection.defaultProps = {
  priority: 0
};
exports.default = (0, _withPrint2.default)((0, _printRegistry2.default)(PrintSection));
module.exports = exports['default'];