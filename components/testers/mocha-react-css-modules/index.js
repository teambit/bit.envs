/**
 * # A testing environment for React components.
 * Bit testing environment for testing of React components using Mocha and ChaiJS.
 *
 * ## How to use?
 * import the environment
 * ```bash
 * bit import bit.envs/testers/mocha-react -t
 * ```
 *
 * ## What's inside?
 * - [Mocha](https://mochajs.org)
 * - [Sinon](http://sinonjs.org)
 * - [Chai](http://chaijs.com) integrated with Sinon to ease mock assersions using 
[sinon-chai](https://github.com/domenic/sinon-chai)
 * - [React test utils](https://facebook.github.io/react/docs/test-utils.html)
 * - [React Dom](https://facebook.github.io/react/docs/react-dom.html)
 * - [mocha-jsdom](https://github.com/rstacruz/mocha-jsdom)
 * - [mockery](https://github.com/mfncooper/mockery) for mocking of package dependencies.
 * - [enzyme](https://github.com/airbnb/enzyme) for general purpose React testing utilities.
 * - [teaspoon](https://github.com/jquense/teaspoon) for testing rendered react components.
 */
const Mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const sinonChai = require('sinon-chai');
const hook = require('css-modules-require-hook');
const sass = require('node-sass');

//const jsdom = require('mocha-jsdom');
const teaspoon = require('teaspoon');
const enzyme = require('enzyme');
const TestUtils = require('react-dom/test-utils');
const React = require('react');
const ReactDom = require('react-dom');
const isEmptyObject = obj => Object.keys(obj).length === 0;
const { shallow } = require('enzyme');

chai.use(sinonChai);

hook({
  extensions: ['.scss', '.sass', '.css'],
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  preprocessCss: data => sass.renderSync({ data }).css
})

function mockDom(markup) {
  // if (typeof document !== 'undefined') return;

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

function normalizeResults(mochaJsonResults) {
  function normalizeError(err) {
    return {
      message: err.message,
      stack: err.stack
    };
  }

  function normalizeStats(stats) {
    return {
      start: stats.start,
      end: stats.end
    };
  }

  function normalizeTest(test) {
    const isError = !isEmptyObject(test.err);
    return ({
      title: test.fullTitle,
      pass: !isError,
      err: isError ? normalizeError(test.err) : null,
      duration: test.duration
    });
  }

  function normalizeFailure(failure) {
    const isError = !isEmptyObject(failure.err);
    return ({
      title: failure.fullTitle,
      err: isError ? normalizeError(failure.err) : null,
      duration: failure.duration
    });
  }

  return {
    tests: mochaJsonResults.tests.map(normalizeTest),
    stats: normalizeStats(mochaJsonResults.stats),
    failures: mochaJsonResults.failures.map(normalizeFailure)
  };
}

const run = (specFile) => {
  return new Promise((resolve) => {
    const mocha = new Mocha({ reporter: JSONReporter });
    mocha.addFile(specFile);
    mocha.run()
      .on('end', function () { // eslint-disable-line
        return resolve(normalizeResults(this.testResults));
      });
  });
};

const getTemplate = (name) => {
  return `import { expect } from 'chai';
import TestUtils from 'react-dom/test-utils';
import jsdom from 'mocha-jsdom';
import React from 'react';

const MyComponent = require(__impl__);
mockDom('<html><body></body></html>');

describe('#MyComponent', () => {
  jsdom({ skipWindowCheck: true });
  let renderedComponent;

  beforeEach(() => {
    renderedComponent = TestUtils.renderIntoDocument(
      <MyComponent />
    );
  });

  it('should do something cool...', () => {
    expect(true).to.equal(true);
  });
});

`;
};

module.exports = {
  run,
  globals: {
    chai,
    sinon,
    mockery,
    mockDom,
    ReactDom,
    shallow
  },
  modules: {
    chai,
    enzyme,
    teaspoon,
    sinon,
    mockery,
    'react-dom/test-utils': TestUtils,
    'react-addons-test-utils': TestUtils,
    // 'mocha-jsdom': jsdom,
    'react-dom': ReactDom
  },
  getTemplate,
};

function Base(runner) {
  var stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 };
  var failures = this.failures = [];

  if (!runner) {
    return;
  }
  this.runner = runner;

  runner.stats = stats;

  runner.on('start', function () {
    stats.start = new Date();
  });

  runner.on('suite', function (suite) {
    stats.suites = stats.suites || 0;
    suite.root || stats.suites++;
  });

  runner.on('test end', function () {
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function (test) {
    stats.passes = stats.passes || 0;

    if (test.duration > test.slow()) {
      test.speed = 'slow';
    } else if (test.duration > test.slow() / 2) {
      test.speed = 'medium';
    } else {
      test.speed = 'fast';
    }

    stats.passes++;
  });

  runner.on('fail', function (test, err) {
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('end', function () {
    stats.end = new Date();
    stats.duration = new Date() - stats.start;
  });

  runner.on('pending', function () {
    stats.pending++;
  });
}

function JSONReporter(runner) {
  Base.call(this, runner);

  var self = this;
  var tests = [];
  var pending = [];
  var failures = [];
  var passes = [];

  runner.on('test end', function (test) {
    tests.push(test);
  });

  runner.on('pass', function (test) {
    passes.push(test);
  });

  runner.on('fail', function (test) {
    failures.push(test);
  });

  runner.on('pending', function (test) {
    pending.push(test);
  });

  runner.on('end', function () {
    var obj = {
      stats: self.stats,
      tests: tests.map(clean),
      pending: pending.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    };

    runner.testResults = obj;
  });
}

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: errorJSON(test.err || {})
  };
}

function errorJSON(err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    res[key] = err[key];
  }, err);
  return res;
}
