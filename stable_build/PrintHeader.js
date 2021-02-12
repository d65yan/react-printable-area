'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _withPrint = require('./withPrint');

var _withPrint2 = _interopRequireDefault(_withPrint);

var _PrintableContext = require('./PrintableContext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Dayan Moreno
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileOverview This component sets a header for the printed content within a PrintArea
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module react-printable-area/PrintHeader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @requires React
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @returns React Component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * import PrintArea from 'react-printable-area/PrintArea';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * import PrintHeader from 'react-printable-area/PrintHeader';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * import PrintTrigger from 'react-printable-area/PrintTrigger';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * // in your render
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * <PrintArea>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <PrintHeader>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     printable header
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   </PrintHeader>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <PrintTrigger><button>Print</button></PrintTrigger>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * </PrintArea>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @note
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * It is a known issue that webkit browser won't repeat the header across printed pages
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var PrintHeader = function (_Component) {
  _inherits(PrintHeader, _Component);

  function PrintHeader() {
    _classCallCheck(this, PrintHeader);

    return _possibleConstructorReturn(this, (PrintHeader.__proto__ || Object.getPrototypeOf(PrintHeader)).apply(this, arguments));
  }

  _createClass(PrintHeader, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.printable.clearHeader();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          setHeader = _props.printable.setHeader,
          children = _props.children;

      return _react2.default.createElement(
        'div',
        {
          style: { position: 'fixed', bottom: '200%', zIndex: -1 }
          // eslint-disable-next-line react/destructuring-assignment
          , ref: setHeader,
          'aria-disabled': 'true',
          'aria-hidden': 'true'
        },
        children
      );
    }
  }]);

  return PrintHeader;
}(_react.Component);

PrintHeader.propTypes = {
  /**
   * Content to be used as Printable Area Header.
   */
  children: _propTypes.node.isRequired,
  /**
   * This is not relevant to the user. It will be provided by Context
   * @ignore
   */
  printable: _PrintableContext.printableShape.isRequired
};
exports.default = (0, _withPrint2.default)(PrintHeader);
module.exports = exports['default'];