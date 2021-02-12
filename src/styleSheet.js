export default className => (
  `
    <style id="print-styles-for-${className}">
      @media screen {
        body .${className} {
          display: block;
          width: 0;
          height: 0;
          overflow: hidden;
        }
      }


      @media print {
        body>*:not(.${className}) {
          display: none !important;
        }
        body .${className} {
          width: 100%;
        }
      }
    </style>
  `
);
