const Mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const sinonChai = require('sinon-chai');
const chaiEnzyme = require('chai-enzyme');
const chaiJsx = require('chai-jsx');
const teaspoon = require('teaspoon');
const enzyme = require('enzyme');
const TestUtils = require('react-dom/test-utils');
const React = require('react');
const ReactDom = require('react-dom');
chai.use(sinonChai);
chai.use(chaiJsx);
const isEmptyObject = obj => Object.keys(obj).length === 0;
const { shallow } =require('enzyme');
chai.use(chaiEnzyme())
var JSDOM = require('jsdom').JSDOM;
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;

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
      .on('end', function() { // eslint-disable-line
        return resolve(normalizeResults(this.testResults));
      });
  });
};

module.exports = {
  run,
  globals: {
    chai,
    sinon,
    mockery,
    ReactDom,
    shallow,
    document,
    window: document.defaultView,
    navigator: {userAgent: 'node.js'}
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
};

function Base (runner) {
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

function JSONReporter (runner) {
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

function clean (test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: errorJSON(test.err || {})
  };
}

function errorJSON (err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    res[key] = err[key];
  }, err);
  return res;
}