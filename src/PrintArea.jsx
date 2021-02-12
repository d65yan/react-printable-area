/* eslint react/no-unused-state: 0 */
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

import React, { Component } from 'react';
import { node, string, number } from 'prop-types';
import classNames from 'classnames';
import printRegistry, { registryShape } from './printRegistry';
import { Provider } from './PrintableContext';
import getStyles from './styleSheet';


class PrintArea extends Component {
  static propTypes = {
    /**
     * Content to be rendered  when the associated trigger is actioned
     * */
    children: node.isRequired,
    /**
    * Maximum time to wait for all the resources to be loaded before print is initiated
    * */
    maxDelay: number,
    /**
    * Document title while printing
    * */
    title: string,
    /**
    * className passed to the div element that wraps the content to print
    * */
    className: string,

    /**
    * className passed to the table that conforms the document to be printed
    * */
    printClassName: string,
    /**
    * @ignore
    * */
    registry: registryShape.isRequired,
  };

  static defaultProps = {
    title: '',
    maxDelay: 1000,
    className: '',
    printClassName: '',
  };

  header = undefined;

  constructor(props) {
    super(props);
    const {
      registry: { getHtml, setRef, ...registry },
      title,
      maxDelay,
    } = this.props;
    this.state = {
      print: this.print.bind(this),
      setHeader: this.setHeader.bind(this),
      clearHeader: this.clearHeader.bind(this),
      title,
      maxDelay,
      ...registry,
    };
  }

  componentDidMount() {
    const media = window.matchMedia('print');
    if (media.addEventListener) {
      media.addEventListener('change', this.mediaChangeHandler);
    } else {
      media.addListener(this.mediaChangeHandler);
    }
  }

  componentWillUnmount() {
    const media = window.matchMedia('print');
    if (media.addEventListener) {
      media.removeEventListener('change', this.mediaChangeHandler);
    } else {
      media.removeListener(this.mediaChangeHandler);
    }
  }

  mediaChangeHandler = (event) => {
    if (event.media === 'print' && !event.matches && this.scrollX !== undefined) {
      document.body.removeChild(this.table);
      document.body.removeChild(this.style);
      document.title = this.realTitle;
      ((x, y) => {
        setTimeout(() => window.scrollTo(x, y), 100);
      })(this.scrollX, this.scrollY);
      this.scrollX = undefined;
      this.scrollY = undefined;
      this.table = undefined;
      this.style = undefined;
      this.realTitle = undefined;
    }
  }

  getHtml = (className) => {
    const { registry, printClassName, className: areaClass } = this.props;
    const sectionsHtml = `
        <table class="${classNames(className, printClassName)}">
          <thead>
            <tr>
              <td>
                ${(this.header && this.header.innerHTML) || ''}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="${areaClass}">
                  ${registry.getHtml()}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
    `;

    return sectionsHtml;
  };

  setHeader = (header) => {
    // istanbul ignore else
    if (header) {
      this.header = header;
    }
  };

  clearHeader = () => { this.header = undefined; };

  print = () => {
    let returnPromise;
    try {
      const frame = document.createElement('div');
      const className = `print-only-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const cssContent = getStyles(className);

      frame.innerHTML = `${cssContent}${this.getHtml(className)}`;

      this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
      this.scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      // eslint-disable-next-line prefer-destructuring
      this.table = frame.getElementsByTagName('table')[0];
      // eslint-disable-next-line prefer-destructuring
      this.style = frame.getElementsByTagName('style')[0];
      document.body.appendChild(this.table);
      document.body.appendChild(this.style);
      const images = this.table.getElementsByTagName('img');

      const timeout = new Promise(resolve => setTimeout(
        () => resolve('print by timeout'),
        this.props.maxDelay) // eslint-disable-line react/destructuring-assignment
      );

      const delay = new Promise(resolve => setTimeout(() => {
        resolve();
      }, 300));

      const loaded = [document.fonts && document.fonts.ready, delay];

      Array.prototype.forEach.call(images, (img) => {
        const promise = img.complete
          ? Promise.resolve(true)
          : new Promise(
            (resolve) => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
            }
          );

        loaded.push(promise);
      });

      const print = (reason) => {
        this.realTitle = document.title;
        // eslint-disable-next-line react/destructuring-assignment
        document.title = this.props.title || this.realTitle;
        window.print();
        return reason;
      };

      const successPrint = Promise.all(loaded).then(() => 'print by success');

      returnPromise = Promise.race([successPrint, timeout])
        .then(print)
        .catch(print);
    } catch (notSupported) {
      this.table = undefined;
      this.style = undefined;
      this.realTitle = undefined;
      // istanbul ignore next line
      if (this.scrollX !== undefined) {
        window.scrollTo(this.scrollX, this.scrollY);
      }
      this.scrollX = undefined;
      this.scrollY = undefined;
      returnPromise = Promise.reject(new Error('could not print'));
    }

    return returnPromise;
  };

  render() {
    const { children, ...attrs } = this.props;
    return (
      <Provider value={this.state}>
        <div {...attrs}>
          {children}
        </div>
      </Provider>
    );
  }
}

export default printRegistry(PrintArea);
