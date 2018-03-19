import baseReporter from './baseReporter';
import startsWithOneOf from '@bit/bit.utils.string.starts-with-one-of';
import mochaHooksNames from './mochaHooksNames';

// Return a plain-object representation of `test`, free of cyclic properties etc.
const clean = (test) => {
    return {
      title: test.title,
      fullTitle: test.fullTitle(),
      duration: test.duration,
      currentRetry: test.currentRetry(),
      err: errorJSON(test.err || {})
    };
  }

// Transform `error` into a JSON object.
const errorJSON = (err) => {
    var res = {};
    Object.getOwnPropertyNames(err).forEach(function (key) {
      res[key] = err[key];
    }, err);
    return res;
  }

const JSONReporter = (runner) => {
    const results = baseReporter(runner);
  
    let tests = [];
    let pending = [];
    let failures = [];
    let passes = [];
    let generalFailures = [];
  
    runner.on('test end', function (test) {
      tests.push(test);
    });
  
    runner.on('pass', function (test) {
      passes.push(test);
    });
  
    runner.on('fail', function (test) {
      if (startsWithOneOf(test.title, mochaHooksNames)) {
        generalFailures.push(test);
      }
      else {
        failures.push(test);
      }
    });
  
    runner.on('pending', function (test) {
      pending.push(test);
    });
  
    runner.on('end', function () {
      var obj = {
        stats: results.stats,
        tests: tests.map(clean),
        pending: pending.map(clean),
        failures: failures.map(clean),
        passes: passes.map(clean),
        generalFailures: generalFailures.map(clean)
      };
  
      runner.testResults = obj;
    });
}

export default JSONReporter;