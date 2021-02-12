import React from 'react';
import noop from 'lodash/noop';
import { shallow, mount } from 'enzyme';
import { PrintArea } from '../src';
import getStyleSheet from '../src/styleSheet';
import Eventful from './helpers/Eventful';
import { Provider } from '../src/PrintableContext';

jest.mock('../src/styleSheet', () => jest.fn(() => '<styles>'));

const media = {
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

window.matchMedia = jest.fn().mockReturnValue(media);

const Area = PrintArea.wrappedComponent;
const registry = {
  register: jest.fn(),
  deregister: jest.fn(),
  getHtml: jest.fn(),
  setRef: jest.fn(),
};
const render = (props = {}) => shallow(<Area {...props} registry={registry} />);
const renderMount = (props = {}) => mount(<Area {...props} registry={registry} />);

const normalizeHtmlString = str => (
  str
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/ *</g, '<')
    .replace(/> */g, '>')
    .trim()
);

describe('Area test', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(0);
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterAll(() => {
    Date.now.mockRestore();
    Math.random.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has all the right methods', () => {
    const area = render();
    const instance = area.instance();
    expect(instance).toMatchObject({
      setHeader: expect.any(Function),
      clearHeader: expect.any(Function),
      getHtml: expect.any(Function),
      print: expect.any(Function),
      header: undefined,
    });
  });

  it('exports the right methods to child context', () => {
    const area = render();
    const provider = area.find(Provider);
    expect(provider.prop('value')).toBe(area.state());
    expect(area.state()).toEqual({
      setHeader: expect.any(Function),
      clearHeader: expect.any(Function),
      print: expect.any(Function),
      title: '',
      maxDelay: 1000,
      register: registry.register,
      deregister: registry.deregister,
    });
  });

  it('setHeader sets the heather element', () => {
    const header1 = { id: 1 };
    const header2 = { id: 2 };

    const area = render();
    const instance = area.instance();
    instance.setHeader(header1);
    instance.setHeader(header2);

    expect(instance.header).toEqual(header2);
  });

  it('clearHeader clears the heather element', () => {
    const header1 = { id: 1 };

    const area = render();
    const instance = area.instance();
    instance.setHeader(header1);
    instance.clearHeader();

    expect(instance.header).toEqual(undefined);
  });

  it('getHtml printable html string', () => {
    const area = render();
    const instance = area.instance();
    const header = {
      id: 1,
      innerHTML: 'headerhtml',
    };

    registry.getHtml.mockReturnValueOnce('<REGISTERED SECTIONS HTML />');
    instance.setHeader(header);

    expect(normalizeHtmlString(instance.getHtml('print-only-0-0'))).toEqual(
      normalizeHtmlString(`
        <table class="print-only-0-0">
          <thead>
            <tr>
              <td>
                headerhtml
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="">
                  <REGISTERED SECTIONS HTML />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
     `));
  });

  it('getHtml printable html string with no header', () => {
    const area = render();
    const instance = area.instance();
    registry.getHtml.mockReturnValueOnce('<REGISTERED SECTIONS HTML />');

    expect(normalizeHtmlString(instance.getHtml('print-only-0-0'))).toEqual(
      normalizeHtmlString(`
        <table class="print-only-0-0">
          <thead>
            <tr>
              <td>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="">
                  <REGISTERED SECTIONS HTML />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `)
    );
  });

  describe('print function', () => {
    let images;
    let fontLoadResolve;
    const area = render();
    const instance = area.instance();
    const table = {
      outerHTML: '<html></html>',
      getElementsByTagName: jest.fn().mockReturnValue(images),
    };

    const style = {
      outerHTML: '<style></style>',
    };

    const fakeFrame = {
      innerHTML: '',
      getElementsByTagName: jest.fn(),
    };

    beforeAll(() => {
      jest.spyOn(instance, 'getHtml');
      instance.getHtml.mockReturnValueOnce('<html>');
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    beforeEach(() => {
      fontLoadResolve = undefined;
      document.fonts = {
        ready: new Promise((resolve) => { fontLoadResolve = resolve; }),
      };
      instance.getHtml.mockClear();
      jest.spyOn(window, 'print').mockImplementation(noop);
      jest.spyOn(document, 'createElement').mockImplementation(noop);
      jest.spyOn(document.body, 'appendChild').mockImplementation(noop);
      jest.spyOn(document.body, 'removeChild').mockImplementation(noop);
      jest.spyOn(window, 'scrollTo').mockImplementation(noop);

      images = [
        new Eventful(), // image that have already loaded
        new Eventful(), // image that will succeed on loading
        new Eventful(), // image that will fail loading
      ];

      images[0].complete = true;

      table.getElementsByTagName.mockReset();
      table.getElementsByTagName.mockReturnValue(images);

      fakeFrame.getElementsByTagName.mockReset();
      fakeFrame.getElementsByTagName
        .mockReturnValueOnce([table])
        .mockReturnValueOnce([style]);

      document.createElement
        .mockReturnValueOnce(fakeFrame);
    });

    afterEach(() => {
      jest.runAllTimers();
      window.print.mockRestore();
      document.createElement.mockRestore();
      document.body.appendChild.mockRestore();
      document.body.removeChild.mockRestore();
      window.scrollTo.mockRestore();
    });

    it('print process', () => {
      const printPromise = instance.print().then((reason) => {
        expect(reason).toEqual('print by success');

        // 1 div is created to build dom nodes from html strings
        expect(document.createElement).toHaveBeenCalledTimes(1);
        expect(document.createElement.mock.calls[0][0]).toEqual('div');

        // 2 stylesheet is requested using the unique className
        expect(getStyleSheet).toHaveBeenCalledTimes(1);
        expect(getStyleSheet).toHaveBeenCalledWith('print-only-0-0');

        // 3 and 4 frameDiv will have the proper content html content
        expect(fakeFrame.innerHTML).toEqual('<styles><html>');

        // 5 - 8 adds the frame content to the body to start printing
        expect(document.body.appendChild).toHaveBeenCalledTimes(2);
        expect(document.body.appendChild).toHaveBeenCalledWith(table);
        expect(document.body.appendChild).toHaveBeenCalledWith(style);

        // 10 waits for all images so we don't get broken img elements
        expect(table.getElementsByTagName).toHaveBeenCalledTimes(1);
        expect(table.getElementsByTagName).toHaveBeenCalledWith('img');

        // 13
        expect(window.print).toHaveBeenCalledTimes(1);
      });

      // will wait for images to finish and at least 300ms
      images[1].trigger('load');
      // it waits at least 300ms before printing for styles to be applied
      jest.runTimersToTime(301); //
      images[2].trigger('error');
      fontLoadResolve();

      return printPromise.then(() => expect(true).toEqual(true));
    });

    it('will wait min of 300ms before printing', () => {
      const printPromise = instance.print();
      fontLoadResolve();
      images[1].trigger('load');
      images[2].trigger('load');
      jest.runTimersToTime(301);
      return printPromise.then(reason => expect(reason).toEqual('print by success'));
    });

    it('will wait for images to succeed or fail', () => {
      fontLoadResolve();
      const printPromise = instance.print();
      images[1].trigger('load');
      jest.runTimersToTime(301);
      jest.runAllTimers();
      return printPromise.then(reason => expect(reason).toEqual('print by timeout'));
    });

    it('waits for fonts to load if exist', () => {
      const printPromise = instance.print();
      images[1].trigger('load');
      images[2].trigger('load');
      jest.runTimersToTime(301);
      jest.runAllTimers();
      return printPromise.then(reason => expect(reason).toEqual('print by timeout'));
    });

    it('returns a rejected promise if print fails', () => {
      document.createElement.mockRestore();
      jest.spyOn(document, 'createElement')
        .mockImplementation(() => { throw new Error('something'); });
      let printPromise;
      instance.scrollX = 100;
      instance.scrollY = 200;
      expect(() => { printPromise = instance.print(); }).not.toThrow('could not print');
      return expect(printPromise)
        .rejects.toEqual(new Error('could not print'))
        .then(() => {
          expect(window.scrollTo).toHaveBeenCalledTimes(1);
          expect(window.scrollTo).toHaveBeenCalledWith(100, 200);
        });
    });
  });

  describe('media matcher', () => {
    beforeEach(() => {
      media.addListener.mockClear();
      media.removeListener.mockClear();
    });

    it('attaches listener using addListener if addEventListener is not supported', () => {
      const areaInstance = renderMount().instance();
      expect(media.addListener).toHaveBeenCalledTimes(1);
      expect(media.addListener).toHaveBeenCalledWith(areaInstance.mediaChangeHandler);
    });

    it('attaches listener using addEventListener if is supported', () => {
      const area = renderMount();
      const areaInstance = area.instance();

      area.unmount();
      expect(media.removeListener).toHaveBeenCalledTimes(1);
      expect(media.removeListener).toHaveBeenCalledWith(areaInstance.mediaChangeHandler);
    });

    it('removes listener using removeListener if removeEventListener is not supported', () => {
      const localMedia = {
        ...media,
        addEventListener: jest.fn(),
      };
      window.matchMedia.mockReturnValueOnce(localMedia);

      const areaInstance = renderMount().instance();
      expect(localMedia.addListener).toHaveBeenCalledTimes(0);
      expect(localMedia.addEventListener).toHaveBeenCalledTimes(1);
      expect(localMedia.addEventListener).toHaveBeenCalledWith('change', areaInstance.mediaChangeHandler);
    });

    it('removes listener using removeEventListener if is supported', () => {
      const localMedia = {
        ...media,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      window.matchMedia.mockReturnValueOnce(localMedia);
      const area = renderMount();
      const areaInstance = area.instance();

      window.matchMedia.mockReturnValueOnce(localMedia);
      area.unmount();

      expect(localMedia.removeListener).toHaveBeenCalledTimes(0);
      expect(localMedia.removeEventListener).toHaveBeenCalledTimes(1);
      expect(localMedia.removeEventListener).toHaveBeenCalledWith('change', areaInstance.mediaChangeHandler);
    });

    describe('media change handler', () => {
      beforeEach(() => {
        jest.spyOn(document.body, 'removeChild').mockImplementation(noop);
        jest.spyOn(window, 'scrollTo').mockImplementation(noop);
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.runAllTimers();
        document.body.removeChild.mockRestore();
        window.scrollTo.mockRestore();
        jest.useRealTimers();
      });

      it('ignores no print media events', () => {
        const event = { media: 'screen', matches: false };
        const areaInstance = render().instance();

        areaInstance.scrollX = 100;
        areaInstance.table = '<table />';
        areaInstance.styles = '<styles />';
        areaInstance.realTitle = 'realTitle';

        areaInstance.mediaChangeHandler(event);

        expect(document.body.removeChild).toHaveBeenCalledTimes(0);
        expect(areaInstance.scrollX).toEqual(100);
        expect(areaInstance.table).toEqual('<table />');
        expect(areaInstance.styles).toEqual('<styles />');
        expect(areaInstance.realTitle).toEqual('realTitle');
      });

      it('will do nothing if there is no defined printable content', () => {
        const event = { media: 'print', matches: false };
        const areaInstance = render().instance();

        areaInstance.scrollX = undefined;
        areaInstance.table = '<table />';
        areaInstance.style = '<styles />';
        areaInstance.realTitle = 'realTitle';

        areaInstance.mediaChangeHandler(event);

        expect(document.body.removeChild).toHaveBeenCalledTimes(0);
        expect(areaInstance.scrollX).toEqual(undefined);
        expect(areaInstance.table).toEqual('<table />');
        expect(areaInstance.style).toEqual('<styles />');
        expect(areaInstance.realTitle).toEqual('realTitle');
      });

      it('removes the registered printable content when leaving the print media', () => {
        const event = { media: 'print', matches: false };
        const areaInstance = render().instance();
        window.scrollX = 0;
        window.scrollY = 0;

        areaInstance.scrollX = 100;
        areaInstance.scrollY = 200;
        areaInstance.table = '<table />';
        areaInstance.style = '<styles />';
        areaInstance.realTitle = 'realTitle';

        areaInstance.mediaChangeHandler(event);

        expect(document.body.removeChild).toHaveBeenCalledTimes(2);
        expect(document.body.removeChild).toHaveBeenCalledWith('<table />');
        expect(document.body.removeChild).toHaveBeenCalledWith('<styles />');
        expect(areaInstance.table).toEqual(undefined);
        expect(areaInstance.style).toEqual(undefined);
        expect(document.title).toEqual('realTitle');

        expect(areaInstance.table).toEqual(undefined);
        expect(areaInstance.style).toEqual(undefined);
        expect(areaInstance.realTitle).toEqual(undefined);
      });

      it('sets the scroll back when leaving the print media', () => {
        const event = { media: 'print', matches: false };
        const areaInstance = render().instance();
        window.scrollX = 0;
        window.scrollY = 0;

        areaInstance.scrollX = 100;
        areaInstance.scrollY = 200;
        areaInstance.table = '<table />';
        areaInstance.style = '<styles />';
        areaInstance.realTitle = 'realTitle';

        areaInstance.mediaChangeHandler(event);

        expect(window.scrollTo).toHaveBeenCalledTimes(0);
        expect(areaInstance.scrollX).toEqual(undefined);
        expect(areaInstance.scrollY).toEqual(undefined);

        jest.runTimersToTime(101);
        expect(window.scrollTo).toHaveBeenCalledTimes(1);
        expect(window.scrollTo).toHaveBeenCalledWith(100, 200);
      });
    });
  });
});
