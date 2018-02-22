import isEmptyObject from '@bit/bit.utils.validation.empty';
import { normalize } from 'path';

const convertKarmaFormatToBitFormat = (results, runStart, runEnd) => {
    let errorsFound = false;
  
    const normalizeError = (test) => {
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

    const normalizeTest = (test) => {
        return ({
          title: test.suite[0] + ' ' + test.description,
          pass: test.success,
          err: !test.success ? normalizeError(test) : null,
          duration: test.endTime - test.startTime
        });
    }

    const getFailures = (results) => {
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
      failures: getFailures(results)
    };
  }

export const getBrowserFailure = () => {
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

export default convertKarmaFormatToBitFormat;