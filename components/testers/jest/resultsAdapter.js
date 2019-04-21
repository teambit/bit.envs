import isEmptyObject from '@bit/bit.utils.validation.empty';

const convertJestFormatToBitFormat = (results) => {
    const testResults = results.testResults;
    let failures = [];
    let testProps = [];
    const res = testResults.map(test => {
      const duration = test.endTime - test.startTime
      if (isEmptyObject(test.assertionResults)) {
        failures.push({
          title: 'Test suite failed to run',
          err: {
            message: test.message
          },
          duration: duration
        });
      } else {
        testProps = test.assertionResults.map(assertionRes => {
          const title = assertionRes.title;
          const pass = (assertionRes.status === 'passed') ? true : false;
          const err = (!pass) ? {  message: assertionRes.failureMessages[0] , stack: assertionRes.failureMessages[0] } : undefined;
          if (err) return { 
            title, pass, duration, err
          }
          return { 
            title, pass, duration
          }
        });
      }
      const StatsProps = {
        start: test.startTime,
        end: test.endTime,
        duration: duration
      } 
      const pass = (test.status === 'passed') ? true : false;
      return {tests: testProps, stats: StatsProps, pass, failures};
    });
    return res[0];
  }

  export const getJestFailure = (message) => {
    return {
      tests: [],
      pass: false,
      stats: {
        start: null,
        end: null
      },
      failures: [{title: 'Jest failure',
        err: {
          message: message
        }
      }]
    }
  };
  export default convertJestFormatToBitFormat;
