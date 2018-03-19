import startsWithOneOf from '@bit/bit.utils.string.starts-with-one-of';
import mochaHooksNames from './mochaHooksNames';

const baseReporter = (runner) => {
    const results = {};
    var stats = results.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0, generalFailures: 0 };
  
    if (!runner) {
      return results;
    }

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
      if (startsWithOneOf(test.title, mochaHooksNames)) {
        stats.generalFailures = stats.generalFailures || 0;
        stats.generalFailures++;
      } else {
        stats.failures = stats.failures || 0;
        stats.failures++;
      }

      test.err = err;
    });
  
    runner.on('end', function () {
      stats.end = new Date();
      stats.duration = new Date() - stats.start;
    });
  
    runner.on('pending', function () {
      stats.pending++;
    });

    return results;
}

export default baseReporter;