import getStyles from '../src/styleSheet';

describe('', () => {
  const styles = getStyles('customClassName');

  it('uses the given class to set the selectors', () => {
    const screenSelector = `@media screen {
        body .customClassName {`;

    const printSelector = `@media print {
        body>*:not(.customClassName) {`;

    expect(styles).toContain(screenSelector);
    expect(styles).toContain(printSelector);
  });

  it('styles regression', () => {
    expect(styles).toMatchSnapshot();
  });
});
