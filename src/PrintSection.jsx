import React, { Component } from 'react';
import { node, number } from 'prop-types';
import printRegistry, { registryShape } from './printRegistry';
import { printableShape, Provider } from './PrintableContext';
import withPrint from './withPrint';


class PrintSection extends Component {
  static propTypes = {
    /**
     * Value used to sort in decreasing order the Sections to print
    * */
    priority: number,
    /**
     * Content to be used as Printable Area Section.
     */
    children: node.isRequired,
    /**
     * @ignore
     * */
    printable: printableShape.isRequired,
    /**
     * @ignore
     * */
    registry: registryShape.isRequired,
  };

  static defaultProps = {
    priority: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...props.printable,
      ...props.registry,
    };
  }

  componentWillUnmount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.printable.deregister(this.props.registry.getHtml);
  }

  setRef = (section) => {
    if (section) {
      const { printable, priority, registry: { getHtml, setRef } } = this.props;
      setRef(section);
      printable.register(getHtml, priority);
    }
  };

  render() {
    // eslint-disable-next-line object-curly-newline
    const { priority, registry, printable, children, ...attrs } = this.props;
    return (
      <Provider value={this.state}>
        <div {...attrs} ref={this.setRef}>
          {children}
        </div>
      </Provider>
    );
  }
}

export default withPrint(
  printRegistry(PrintSection)
);
