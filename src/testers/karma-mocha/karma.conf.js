require('karma-mocha');
require('karma-sinon-chai');
require('karma-chrome-launcher');
require('karma-webpack');
require('webpack');
require('mocha');
require('chai');
require('sinon');
require('sinon-chai');
process.env.CHROME_BIN = require('puppeteer').executablePath();

import path from 'path';
import webpack from 'webpack';
import getFileName from '@bit/bit.utils.file.extract-file-name-from-path';

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
    browsers: ['Chrome_no_sandbox'],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
        ],
      },
    },
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