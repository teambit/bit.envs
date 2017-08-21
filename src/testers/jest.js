/**
 * # A testing environment for React components using Jest.
 * Bit testing environment for testing of React components using Jest.
 *
 * ## How to use?
 * import the environment
 * ```bash
 * bit import bit.envs/testers/jest -t
 * ```
 *
 * ## What's inside?
 * - [Jest](https://facebook.github.io/jest/)
 * - [Sinon](http://sinonjs.org)
 * - [React test utils](https://facebook.github.io/react/docs/test-utils.html)
 * - [React Dom](https://facebook.github.io/react/docs/react-dom.html)
 * - [mocha-jsdom](https://github.com/rstacruz/mocha-jsdom)
 */
const jest = require('jest');
const sinon = require('sinon');
const TestUtils = require('react-dom/test-utils');
const ReactDom = require('react-dom');
const isEmptyObject = obj => Object.keys(obj).length === 0;
const exec = require('child-process-promise').exec;

function mockDom(markup) {
  var jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const { document } = (new JSDOM(markup || '')).window;
  global.document = document;
  global.window = document.defaultView;
  global.shallow = shallow;
  global.navigator = {
    userAgent: 'node.js'
  };
}

const normalizeResults = (stdout) => {
  const results = JSON.parse(stdout)
  const testResults = results.testResults;
  const res = testResults.map(test=> {
    const duration = test.endTime - test.startTime
    const testProps = test.assertionResults.map(assertionRes => {
      const title = assertionRes.title;
      const pass = (assertionRes.status === 'passed') ? true : false;
      const err = (!pass) ? {  message: assertionRes.failureMessages[0] , stack: assertionRes.failureMessages[0] } : undefined;
      if (err) return {title, pass, duration, err}
      return {title, pass, duration}
    });
    const StatsProps = {
      start: test.startTime,
      end: test.endTime,
      duration: duration
    }
    const pass = (test.status === 'passed') ? true : false;
    return {tests: testProps, stats: StatsProps, pass};
  });

  return res[0];
}
const run = (specFile) => {
  return exec(`node ${__dirname}/node_modules/.bin/jest ${specFile} --json`).then(({err, stdout, stderr}) => {
    return parseResults(stdout);
  }).catch(({message, stdout, stderr}) =>{
    return parseResults(stdout);
  });
}

module.exports = {
  run,
  globals: {
    jest,
    sinon,
    mockDom,
    ReactDom
  },
  modules: {
    jest,
    sinon,
    'react-dom/test-utils': TestUtils,
    'react-addons-test-utils': TestUtils,
    'react-dom': ReactDom
  }
};