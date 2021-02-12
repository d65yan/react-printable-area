/**
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

import { Component, createElement } from 'react';
import { string, shape, func } from 'prop-types';
import get from 'lodash/get';

export default wrapped => class extends Component {
  static displayName = `printRegistry(${get(wrapped, 'displayName', wrapped.name)})`;

  static wrappedComponent = wrapped;

  static propTypes = {
    className: string.isRequired,
  };

  sections = [];

  constructor(props) {
    super(props);
    this.state = {
      register: this.register.bind(this),
      deregister: this.deregister.bind(this),
      getHtml: this.getHtml.bind(this),
      setRef: this.setRef.bind(this),
    };
  }

  getSectionIndex = htmlGetter => this.sections.indexOf(
    this.sections.find(record => record.htmlGetter === htmlGetter)
  );

  getIsSectionRegistered = htmlGetter => this.getSectionIndex(htmlGetter) > -1;


  setRef = (printableRef) => { this.printableRef = printableRef; };

  getHtml() {
    const { className } = this.props;
    // eslint-disable-next-line unicorn/explicit-length-check
    if (!this.sections.length) {
      return (this.printableRef && this.printableRef.outerHTML) || '';
    }

    const htmlSections = this.sections.slice();
    htmlSections.sort((a, b) => {
      const nA = Number(a.priority || 0);
      const nB = Number(b.priority || 0);
      return nA === nB ? 0 : ((nB - nA) / Math.abs(nB - nA));
    });

    return `
      <div class="${className}">
        ${htmlSections.map(({ htmlGetter }) => htmlGetter()).join('\n\r')}
      </div>`;
  }

  deregister = (htmlGetter) => {
    const sectionIndex = this.getSectionIndex(htmlGetter);
    if (sectionIndex > -1) {
      this.sections.splice(sectionIndex, 1);
    }
  };

  register = (htmlGetter, priority) => (
    htmlGetter
    && !this.getIsSectionRegistered(htmlGetter)
    && this.sections.push({ htmlGetter, priority })
  );

  render() {
    return createElement(
      wrapped,
      {
        ...this.props,
        registry: this.state,
      }
    );
  }
};

export const registryShape = shape({
  register: func,
  deregister: func,
  getHtml: func,
  setRef: func,
});
