const path = require('path');
const fse = require('fs-extra');
const karma = require('karma');
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
  run
};