require('@babel/preset-env');
require('@babel/plugin-proposal-class-properties');
require('@babel/plugin-proposal-export-default-from');
require('@babel/plugin-proposal-export-namespace-from');

const baseCompile = require('../../internal/babelBaseCompiler');
const compiledFileTypes = ['js', 'jsx', 'ts'];

const compile = (files, distPath) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
}

export default {
  compile
};