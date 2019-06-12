require('@babel/plugin-proposal-class-properties');
require('@babel/plugin-proposal-object-rest-spread');
require('@babel/plugin-transform-react-jsx');
require('@babel/plugin-transform-regenerator');
require('@babel/plugin-transform-async-to-generator');
require('@babel/preset-env');
require('@babel/preset-react');
require('@babel/plugin-proposal-decorators');
// require('babel-plugin-transform-object-entries');
// require('babel-plugin-object-values-to-object-keys');
require('@babel/plugin-proposal-export-namespace-from');
require('@babel/plugin-proposal-export-default-from');

const baseCompile = require('../../internal/babelBaseCompiler');

const compiledFileTypes = ['js', 'jsx', 'ts'];

const compile = (files, distPath) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
}

export default {compile};