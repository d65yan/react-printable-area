import { createContext } from 'react';
import { shape, func, number, string } from 'prop-types';

export const { Consumer, Provider } = createContext();
export const printableShape = shape({
  clearHeader: func,
  getIsSectionRegistered: func,
  maxDelay: number,
  print: func,
  register: func,
  deregsiter: func,
  setHeader: func,
  title: string,
});
