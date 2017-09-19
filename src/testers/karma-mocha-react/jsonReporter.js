'use strict';
var path = require('path');
var fse = require('fs-extra');

//
var JSONReporter = function (baseReporterDecorator, config, helper, logger) {

  var log = logger.create('karma-json-reporter');
  baseReporterDecorator(this);

  var history = {
    browsers : {},
    result : {},
    summary : {}
  };

  var reporterConfig = config.jsonReporter || {};
  var stdout = typeof reporterConfig.stdout !== 'undefined' ? reporterConfig.stdout : true;
  var outputFile = (reporterConfig.outputFile) ? helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile )) : null;

  this.onSpecComplete = function(browser, result) {
    history.result[browser.id] = history.result[browser.id] || [];
    history.result[browser.id].push(result);

    history.browsers[browser.id] = history.browsers[browser.id] || browser;
  };

  this.onRunComplete = function(browser, result) {
    history.summary = result;
    if(stdout) process.stdout.write(JSON.stringify(history));
    if(outputFile) {
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