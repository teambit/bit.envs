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
 * - [enzyme](https://github.com/airbnb/enzyme) for general purpose React testing utilities.
 */

const mockery = require('mockery');
const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
chai.use(chaiEnzyme())
const path = require('path');
const fse = require('fs-extra');
const teaspoon = require('teaspoon');
const TestUtils = require('react-dom/test-utils');
const React = require('react');
const ReactDom = require('react-dom');
const karma = require('karma');
const enzyme = require('enzyme');
require('react-test-renderer');
const { shallow } = require('enzyme');
const getFileName = require('./extractFileNameFromPath');
require('./karma.conf');
const isEmptyObject = obj => Object.keys(obj).length === 0;
const exec = require('child-process-promise').exec;

const readResults = (filePath) => {
  const resultsFilePath = path.resolve(`${__dirname}/${filePath}-results.json`);

  let parsedResults = {};

  try {
    parsedResults = fse.readJsonSync(resultsFilePath);
  }
  catch (e) {
    return {failures: [{title:'Cannot read results file',err:{message:e.message}}]};
  }

  try {
    fse.removeSync(resultsFilePath);
  }
  catch (e) {
    console.log('Cannot delete results file: ' + e.message);
  }

  return parsedResults;
}

function normalizeResults(results, runStart, runEnd) {
  
  let errorsFound = false;

  function normalizeError(test) {
    errorsFound = true;
    let message = 'No info regarding error';
    let stack = 'No info regarding error';
    
    if (test.log.length > 0) {
      const errorLines = test.log[0].split('at');
      message = errorLines.shift();
      stack = 'at ' + errorLines.join('at');
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

  function getFailures() {
    let failures = results.failures || [];

    if (failures.length == 0 && !errorsFound && results.summary.error) {
      failures[0] = {title:'Karma failure',err:{message:''}};
    }

    return failures;
  }

  return {
    tests: results.result && !isEmptyObject(results.result) ?
      Object.values(results.result)[0].map(normalizeTest) :
      [],
    stats: {
      start: runStart,
      end: runEnd
    },
    failures: getFailures()
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
    let isBrowserValid = false;
    server.start();

    server.on('browser_register', browsers => {
      isBrowserValid = true;
    });

    server.on('run_complete', (browsers, resultsSummary) => {
      const runEnd = new Date();
      const parsedResults = readResults(getFileName(specFile));
      //console.log(parsedResults);
      browsers.forEach(a => console.log(a));

      if (!isBrowserValid) {
        return resolve(normalizeBrowserFailure());
      }

      if (isEmptyObject(parsedResults)) {
        return resolve({});
      }
      
      const normalizedResults = normalizeResults(parsedResults, runStart, runEnd);
      return resolve(normalizedResults);
    });
    
  });
};

const normalizeBrowserFailure = () => {
  return {
    tests: [],
    pass: false,
    stats: {
      start: null,
      end: null
    },
    failures: [{title: 'Cannot find browser',
      err: {
        message: ''
      }
    }]
  }
};

module.exports = {
  run,
  globals: {
    mockery,
    ReactDom,
    shallow,
    chai,
    sinon
  },
  modules: {
    teaspoon,
    mockery,
    enzyme,
    chai,
    sinon,
    'react-dom/test-utils': TestUtils,
    'react-addons-test-utils': TestUtils,
    'react-dom': ReactDom
  }
};