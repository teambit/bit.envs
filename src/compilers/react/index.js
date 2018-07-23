require('babel-plugin-transform-class-properties');
require('babel-plugin-transform-object-rest-spread');
require('babel-plugin-transform-react-jsx');
require('babel-plugin-transform-regenerator');
require('babel-plugin-transform-async-to-generator');
require('babel-preset-latest');
require('babel-preset-react');
require('babel-plugin-transform-decorators-legacy');
require('babel-plugin-transform-object-entries');
require('babel-plugin-object-values-to-object-keys');
require('babel-plugin-transform-export-extensions');

const baseCompile = require('../../internal/babelBaseCompiler');

const compiledFileTypes = ['js', 'jsx'];

const compile = (files, distPath) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
}

export default {compile};