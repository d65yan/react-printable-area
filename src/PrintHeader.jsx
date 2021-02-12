/**
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

import React, { Component } from 'react';
import { node } from 'prop-types';
import withPrint from './withPrint';
import { printableShape } from './PrintableContext';

class PrintHeader extends Component {
  static propTypes = {
    /**
     * Content to be used as Printable Area Header.
     */
    children: node.isRequired,
    /**
     * This is not relevant to the user. It will be provided by Context
     * @ignore
     */
    printable: printableShape.isRequired,
  };

  componentWillUnmount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.printable.clearHeader();
  }

  render() {
    const { printable: { setHeader }, children } = this.props;
    return (
      <div
        style={{ position: 'fixed', bottom: '200%', zIndex: -1 }}
        // eslint-disable-next-line react/destructuring-assignment
        ref={setHeader}
        aria-disabled="true"
        aria-hidden="true"
      >
        {children}
      </div>
    );
  }
}

export default withPrint(PrintHeader);
