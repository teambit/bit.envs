require('karma-mocha');
require('karma-sinon-chai');
require('karma-chrome-launcher');
require('karma-webpack');

const path = require('path');
const webpack = require('webpack');
const getFileName = require('./extractFileNameFromPath');

module.exports = (config) => {
  const { env } = process;

  const preprocessors = {};
  const filePath = config.files[0];
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
    browsers: ['ChromeHeadless'],

    // This explicitly doesn't use webpack-merge because we want to override
    // the DefinePlugin in the base config.
    webpack: {
      entry: config.files,
      // Bit testing environment injects the 'modules' using mockery, but that doesn't work when using karma with webpack.
      // Therefore, we instruct webpack to resolve modules from the tester's node_modules directory first, and then search for modules as usual. 
      resolve: {
        modules: [path.resolve(__dirname, "../../../node_modules/"), "node_modules"]
      },
      devtool: 'cheap-module-inline-source-map'
    },
    webpackMiddleware: {
      noInfo: true,
    },
    preprocessors
  });
};