const baseCompile = require('../../internal/babelBaseCompiler');
const compiledFileTypes = ['js', 'jsx'];

const compile = (files, distPath) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
}

export default {
  compile
};