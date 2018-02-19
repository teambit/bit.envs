import {JSDOM} from 'jsdom';
import convertMochaFormatToBitFormat from './resultsAdapter';
import Mocha from 'mocha';
import JSONReporter from './jsonReporter';
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;

const run = (specFile) => {
  return new Promise((resolve) => {
    const mocha = new Mocha({ reporter: JSONReporter });
    mocha.addFile(specFile);
    mocha.run()
    .on('end', function() { // eslint-disable-line
      return resolve(convertMochaFormatToBitFormat(this.testResults));
    });
  });
};

export default {
  run,
  globals: {
    window: document.defaultView,
    navigator: {userAgent: 'node.js'}
  }
};