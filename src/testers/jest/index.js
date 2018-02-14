const jest = require('jest');
const path = require('path');
const fs = require('fs');
const isEmptyObject = obj => Object.keys(obj).length === 0;
const exec = require('child-process-promise').exec;

const normalizeResults = (results) => {
  const testResults = results.testResults;
  let failures = [];
  let testProps = [];
  const res = testResults.map(test=> {
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
    
    return {tests: testProps, stats: StatsProps, pass, failures};
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
    const cmd = `${process.execPath} ${jestPath} ${specFile} --json --outputFile="${resultsFilePath}"`;
  return exec(cmd).then(({err, stdout, stderr}) => {
    const parsedResults = readResults(resultsFilePath);
    return normalizeResults(parsedResults);
  }).catch(({message, stdout, stderr}) =>{
    // We can arrive here for two reasons:
    // 1. Testing is finished with errors, and then we want to parse the error from the results
    // 2. Error in testing process, and then we parse the catch error.
    try {
      const parsedResults = readResults(resultsFilePath);
      return normalizeResults(parsedResults);
    }
    catch(err) {
      return normalizeJestFailure(message);
    }
  });
}

const normalizeJestFailure = (message) => {
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

const extractFileNameFromPath = (filePath) => {
  let fileName = filePath.split('/').pop();
  return fileName.split('.')[0];
};

module.exports = {
  run,
  globals: {
    jest
  },
  modules: {
    jest
  }
};