"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (className) {
  return "\n    <style id=\"print-styles-for-" + className + "\">\n      @media screen {\n        body ." + className + " {\n          display: block;\n          width: 0;\n          height: 0;\n          overflow: hidden;\n        }\n      }\n\n\n      @media print {\n        body>*:not(." + className + ") {\n          display: none !important;\n        }\n        body ." + className + " {\n          width: 100%;\n        }\n      }\n    </style>\n  ";
};

module.exports = exports["default"];