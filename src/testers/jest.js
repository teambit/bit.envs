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
const React = require('react');
const ReactDom = require('react-dom');
const path = require('path');
const fs = require('fs');
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

const normalizeResults = (results) => {
  const testResults = results.testResults;
  let failures = [];
  const res = testResults.map(test=> {
    const duration = test.endTime - test.startTime

    if (isEmptyObject(test.assertionResults)) {
      failures.push({
        title: 'Test suite failed to run',
        err: test.message,
        duration: duration
      });
    } else {
      const testProps = test.assertionResults.map(assertionRes => {
        const title = assertionRes.title;
        const pass = (assertionRes.status === 'passed') ? true : false;
        const err = (!pass) ? {  message: assertionRes.failureMessages[0] , stack: assertionRes.failureMessages[0] } : undefined;
        if (err) return {title, pass, duration, err}
        return {title, pass, duration}
      });
    }

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

const readResults = (filePath = 'results.json') => {
  const results = fs.readFileSync(filePath);
  const parsedResults = JSON.parse(results);
  fs.unlinkSync(filePath);
  return parsedResults;
}

const run = (specFile) => {
    const resultsFilePath = `${extractFileNameFromPath(specFile)}-results.json`;
    const jestPath = path.resolve(__dirname, '../../', 'node_modules/.bin/jest');
    // We are using outputFile flag because in some cases when using --json only
    // There is not valid json return, see details here:
    // https://github.com/facebook/jest/issues/4399
    const cmd = `node ${jestPath} ${specFile} --json --outputFile="${resultsFilePath}"`;
  return exec(cmd).then(({err, stdout, stderr}) => {
    const parsedResults = readResults(resultsFilePath);
    return normalizeResults(parsedResults);
  }).catch(({message, stdout, stderr}) =>{
    const parsedResults = readResults(resultsFilePath);
    return normalizeResults(parsedResults);
  });
}

const extractFileNameFromPath = (filePath) => {
  let fileName = filePath.split('/').pop();
  return fileName.split('.')[0];
};

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