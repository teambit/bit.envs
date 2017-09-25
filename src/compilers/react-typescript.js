/**
 * # A Component compiler for React components using TypeScript.
 * Compiles a React component for [TypeScript](https://www.typescriptlang.org/).
 * 
 *  ## How to use?
 * 
 * Import the environment
 * ```bash
 *  bit import bit.envs/compilers/react-typescript -c
 * ```
 * @bit
 */

const ts = require('typescript');
const Vinyl = require('vinyl');
const path = require('path');

const compileSingleFile = (file, compilerOptions, distPath) => {
  const result = ts.transpileModule(file.contents.toString(), { compilerOptions });

  const mappings = new Vinyl({
    contents: new Buffer(result.sourceMapText),
    base: distPath,
    path: _getDistFilePath(file, distPath),
  });
  mappings.basename = _getRevisedFileExtension(file.basename) + '.map';

  const fileContent = result.outputText ?  new Buffer(`${result.outputText}\n\n//# sourceMappingURL=${result.sourceMapText}`) : new Buffer(result.outputText);
  const distFile = _getDistFile(file, distPath, fileContent);

  return [mappings,distFile];
};

function compile(files, distPath) {
  const compilerOptions =  {
    module: ts.ModuleKind.CommonJS,
    sourceMap: true,
    jsx: 'react'
  };
  
  return files.map(file => compileSingleFile(file, compilerOptions, distPath)).reduce((a, b) => a.concat(b));
}

const _getDistFile = (file, distPath, content) => {
  let distFile = file.clone();
  distFile.base = distPath;
  distFile.path = _getDistFilePath(file, distPath);

  if (content) {
    distFile.contents = content;
  }

  return distFile;
}

const _getDistFilePath = (file, distPath) => {
  return path.join(distPath, _getRevisedFileExtension(file.relative)); 
}

const _getRevisedFileExtension = (fileName) => {
  return fileName.replace('.tsx', '.js').replace('.ts', '.js');
}

module.exports = {
  compile
};