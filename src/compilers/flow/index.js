require('babel-preset-latest');
require('babel-plugin-transform-flow-strip-types');
require('babel-plugin-transform-object-rest-spread');
require('babel-plugin-add-module-exports');
require('babel-plugin-transform-decorators-legacy');
require('babel-plugin-transform-object-entries');
require('babel-plugin-object-values-to-object-keys');

const baseCompile = require('../../utils/babelBaseCompiler');

const compiledFileTypes = ['js', 'jsx', 'ts'];

const compile = (files, distPath) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
}

export default {compile};