'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registryShape = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Dayan Moreno
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileOverview This component marks an area from which content can be printed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module react-printable-area/PrintArea
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @requires React
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {string} title - Page title to used on printed document
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {string} printMode - [popup|iframe] if none is provided iframe will be used for all
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * browser but FireFox
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

exports.default = function (wrapped) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.sections = [];

      _this.getSectionIndex = function (htmlGetter) {
        return _this.sections.indexOf(_this.sections.find(function (record) {
          return record.htmlGetter === htmlGetter;
        }));
      };

      _this.getIsSectionRegistered = function (htmlGetter) {
        return _this.getSectionIndex(htmlGetter) > -1;
      };

      _this.setRef = function (printableRef) {
        _this.printableRef = printableRef;
      };

      _this.deregister = function (htmlGetter) {
        var sectionIndex = _this.getSectionIndex(htmlGetter);
        if (sectionIndex > -1) {
          _this.sections.splice(sectionIndex, 1);
        }
      };

      _this.register = function (htmlGetter, priority) {
        return htmlGetter && !_this.getIsSectionRegistered(htmlGetter) && _this.sections.push({ htmlGetter: htmlGetter, priority: priority });
      };

      _this.state = {
        register: _this.register.bind(_this),
        deregister: _this.deregister.bind(_this),
        getHtml: _this.getHtml.bind(_this),
        setRef: _this.setRef.bind(_this)
      };
      return _this;
    }

    _createClass(_class, [{
      key: 'getHtml',
      value: function getHtml() {
        var className = this.props.className;
        // eslint-disable-next-line unicorn/explicit-length-check

        if (!this.sections.length) {
          return this.printableRef && this.printableRef.outerHTML || '';
        }

        var htmlSections = this.sections.slice();
        htmlSections.sort(function (a, b) {
          var nA = Number(a.priority || 0);
          var nB = Number(b.priority || 0);
          return nA === nB ? 0 : (nB - nA) / Math.abs(nB - nA);
        });

        return '\n      <div class="' + className + '">\n        ' + htmlSections.map(function (_ref) {
          var htmlGetter = _ref.htmlGetter;
          return htmlGetter();
        }).join('\n\r') + '\n      </div>';
      }
    }, {
      key: 'render',
      value: function render() {
        return (0, _react.createElement)(wrapped, _extends({}, this.props, {
          registry: this.state
        }));
      }
    }]);

    return _class;
  }(_react.Component), _class.displayName = 'printRegistry(' + (0, _get2.default)(wrapped, 'displayName', wrapped.name) + ')', _class.wrappedComponent = wrapped, _class.propTypes = {
    className: _propTypes.string.isRequired
  }, _temp;
};

var registryShape = exports.registryShape = (0, _propTypes.shape)({
  register: _propTypes.func,
  deregister: _propTypes.func,
  getHtml: _propTypes.func,
  setRef: _propTypes.func
});