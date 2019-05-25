const path = require('path');
const webpack = require('webpack');
require('mocha');
require('karma-mocha');
require('chai');
require('sinon');
require('sinon-chai');
require('karma-sinon-chai');
require('karma-chrome-launcher');
require('karma-webpack');

const getFileName = require('@bit/bit.utils.file.extract-file-name-from-path');

module.exports = (config) => {
  const { env } = process;
  const filePath = config.files[0];
  const preprocessors = {};
  preprocessors[filePath] = ['webpack'];

  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    plugins: [
      'karma-mocha', 
      'karma-sinon-chai', 
      'karma-chrome-launcher',
      'karma-webpack',
      require('./jsonReporter')
    ],
    reporters: ['json'],
    browsers: ['ChromeHeadless'],
    jsonReporter: {
      stdout: false,
      outputFile: getFileName(filePath) + '-results.json'      
    },
    client: {
      chai: {
        includeStack: true
      }
    },
    singleRun: true,
    captureConsole: false,
    webpack: {
      entry: config.files,
      // Bit testing environment injects the 'modules' using mockery, but that doesn't work when using karma with webpack.
      // Therefore, we instruct webpack to resolve modules from the tester's node_modules directory first, and then search for modules as usual. 
      resolve: {
        modules: [path.normalize(`${__dirname}${path.sep}..${path.sep}node_modules`), "node_modules"]
      },
      devtool: 'cheap-module-inline-source-map'
    },
    webpackMiddleware: {
      noInfo: true,
    },
    preprocessors
  });
};