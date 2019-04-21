require('@babel/preset-env');
require('@babel/preset-react');
require('@babel/plugin-proposal-class-properties');
require('@babel/plugin-proposal-export-default-from');
require('@babel/plugin-proposal-export-namespace-from');

const baseCompile = require('../../internal/babelBaseCompiler');
const compiledFileTypes = ['js', 'jsx'];

const compile = (files, distPath) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
}

export default {
  compile
};