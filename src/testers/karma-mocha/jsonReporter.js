import path from 'path';
import fse from 'fs-extra';

const JSONReporter = function(baseReporterDecorator, config, helper, logger) {
  const log = logger.create('karma-json-reporter');
  baseReporterDecorator(this);

  const history = {
    browsers : {},
    result : {},
    summary : {}
  };

  const reporterConfig = config.jsonReporter || {};
  const stdout = typeof reporterConfig.stdout !== 'undefined' ? reporterConfig.stdout : true;
  const outputFile = (reporterConfig.outputFile) ? helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile )) : null;

  this.onSpecComplete = (browser, result) => {
    history.result[browser.id] = history.result[browser.id] || [];
    history.result[browser.id].push(result);

    history.browsers[browser.id] = history.browsers[browser.id] || browser;
  };

  this.onRunComplete = (browser, result) => {
    history.summary = result;
    
    if (stdout) {
      process.stdout.write(JSON.stringify(history));
    }

    if (outputFile) {
      fse.ensureDirSync(path.dirname(outputFile));
      fse.writeJsonSync(outputFile, history); 
    }
    
    history.result = {};
  };
};

JSONReporter.$inject = ['baseReporterDecorator','config','helper','logger'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:json': ['type', JSONReporter]
};