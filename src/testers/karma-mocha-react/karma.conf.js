require('babel-register');
require('karma-json-reporter');
require('karma-mocha');
require('karma-sinon-chai');
require('karma-chrome-launcher');
require('karma-webpack');

const webpack = require('webpack');
const getFileName = require('./extractFileNameFromPath');

//const webpackConfigBase = require('./webpack.config');

module.exports = (config) => {
  const { env } = process;

  const preprocessors = {};
  const filePath = config.files[0];
  preprocessors[filePath] = ['webpack'];

  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    plugins: [
      'karma-json-reporter', 
      'karma-mocha', 
      'karma-sinon-chai', 
      'karma-chrome-launcher',
      'karma-webpack'
    ],
    reporters: ['json'],
  
    jsonReporter: {
      stdout: false,
      outputFile: getFileName(filePath) + '-results.json'      
    },
    customLaunchers: {
      ChromeCi: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    client: {
      chai: {
        includeStack: true
      }
    },
    singleRun: true,
    captureConsole: false,
    browsers: env.BROWSER ? env.BROWSER.split(',') : ['Chrome'],

    // This explicitly doesn't use webpack-merge because we want to override
    // the DefinePlugin in the base config.
    webpack: {
      entry: config.files,
      module: {
        loaders: [
        { test: /\.js/, loader: 'babel-loader?cacheDirectory', exclude: /node_modules/ }
        ]
    },
      
      devtool: 'cheap-module-inline-source-map'
    },
    webpackMiddleware: {
      noInfo: true,
    },
    preprocessors
  });
};