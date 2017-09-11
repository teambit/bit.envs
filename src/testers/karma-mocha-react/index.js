/**
 * # A testing environment for React components using karma.
 * Bit testing environment for testing of React components using Karma, with Mocha and ChaiJS.
 *
 * ## How to use?
 * import the environment
 * ```bash
 * bit import bit.envs/testers/karma-mocha-react -t
 * ```
 *
 * ## What's inside?
 * - [Karma](https://karma-runner.github.io/1.0/index.html)
 * - [Mocha](https://mochajs.org)
 * - [Sinon](http://sinonjs.org)
 * - [Chai](http://chaijs.com) integrated with Sinon to ease mock assertions using [sinon-chai](https://github.com/domenic/sinon-chai)
 * - [React test utils](https://facebook.github.io/react/docs/test-utils.html)
 * - [React Dom](https://facebook.github.io/react/docs/react-dom.html)
 * - [mockery](https://github.com/mfncooper/mockery) for mocking of package dependencies.
 * - [teaspoon](https://github.com/jquense/teaspoon) for testing rendered react components.
 */

const mockery = require('mockery');
const sinonChai = require('sinon-chai');
const path = require('path');
const fse = require('fs-extra');
const teaspoon = require('teaspoon');
const TestUtils = require('react-dom/test-utils');
const ReactDom = require('react-dom');
const karma = require('karma');
const getFileName = require('./extractFileNameFromPath');
require('./karma.conf');
const isEmptyObject = obj => Object.keys(obj).length === 0;
const exec = require('child-process-promise').exec;

const readResults = (filePath) => {
  const resultsFilePath = path.resolve(`${__dirname}/${filePath}-results.json`);
  
  if (!fse.ensureFileSync(resultsFilePath)) {
    console.error(`Cannot find test results file: ${resultsFilePath}`);
    return {};
  }

  const parsedResults = fse.readJsonSync(resultsFilePath);
  //const parsedResults = JSON.parse(results);
  fse.removeSync(resultsFilePath);
  return parsedResults;
}

function normalizeResults(results, runStart, runEnd) {
  
  function normalizeError(test) {
    let message = 'No info regarding error';
    let stack = 'No info regarding error';
    
    if (test.log.length > 0) {
        const errorLines = test.log[0].split('\n');
        message = errorLines.shift();
        stack = errorLines.join('\n');
    }
    
    return {
      message,
      stack
    };
  }

  function normalizeTest(test) {
      return ({
        title: test.suite[0] + ' ' + test.description,
        pass: test.success,
        err: !test.success ? normalizeError(test) : null,
        duration: test.endTime - test.startTime
      });
  }

  return {
    tests: Object.values(results.result)[0].map(normalizeTest),
    stats: {
      start: runStart,
      end: runEnd
    }
  };
}

const run = (specFile) => {
  
  const karmaConfig = karma.config.parseConfig(path.resolve(__dirname + '/karma.conf.js'), { files: [specFile], port: 9876 } );
  var server = new karma.Server(karmaConfig, function(exitCode) {
    console.info('Karma Server has exited with ' + exitCode)
    process.exit(exitCode)
  });

  let runStart;

  server.on('run_start', browsers => {
    runStart = new Date();
  });

  return new Promise((resolve) => {
    server.start();
    server.on('run_complete', (browsers, resultsSummary) => {

      const runEnd = new Date();
      const parsedResults = readResults(getFileName(specFile));

      if (isEmptyObject(parsedResults)) {
        return {};
      }
      
      const normalizedResults = normalizeResults(parsedResults, runStart, runEnd);
      return resolve(normalizedResults);
    });
  });
};

module.exports = {
  run,
  globals: {
    mockery,
    ReactDom
  },
  modules: {
    teaspoon,
    mockery,
    'react-dom/test-utils': TestUtils,
    'react-addons-test-utils': TestUtils,
    'react-dom': ReactDom
  }
};