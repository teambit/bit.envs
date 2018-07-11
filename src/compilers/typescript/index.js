import ts from 'typescript';
import Vinyl from 'vinyl';
import path from 'path';
import groupBy from '@bit/bit.utils.object.group-by';

const compiledFileTypes = ['tsx', 'ts'];

const compileSingleFile = (file, compilerOptions, distPath) => {
  const result = ts.transpileModule(file.contents.toString(), { compilerOptions });

  const mappings = new Vinyl({
    contents: new Buffer(result.sourceMapText),
    base: distPath,
    path: _getDistFilePath(file, distPath, true),
  });
  mappings.basename = _getRevisedFileExtension(file.basename) + '.map';

  const fileContent = result.outputText ?  new Buffer(`${result.outputText}\n\n//# sourceMappingURL=${result.sourceMapText}`) : new Buffer(result.outputText);
  const distFile = _getDistFile(file, distPath, true, fileContent);

  return [mappings,distFile];
};

const compile = (files, distPath) => {
  const compilerOptions =  {
    module: ts.ModuleKind.CommonJS,
    sourceMap: true,
    jsx: 'react'
  };

  // Divide files by whether we should compile them, according to file type.
  const filesByToCompile = groupBy(files, _toCompile);
  
  const compiled = (!filesByToCompile.true || filesByToCompile.true.length === 0) ? [] : filesByToCompile.true.map(file => compileSingleFile(file, compilerOptions, distPath)).reduce((a, b) => a.concat(b));
  const nonCompiled = !filesByToCompile.false ? [] : filesByToCompile.false.map(file => _getDistFile(file, distPath, false));

  return compiled.concat(nonCompiled);;
}

const _toCompile = (file) => {
  return compiledFileTypes.indexOf(file.extname.replace('.','')) > -1 && !file.stem.endsWith('.d');
}

const _getDistFile = (file, distPath, reviseExtension, content) => {
  let distFile = file.clone();
  distFile.base = distPath;
  distFile.path = _getDistFilePath(file, distPath, reviseExtension);

  if (content) {
    distFile.contents = content;
  }

  return distFile;
}

const _getDistFilePath = (file, distPath, reviseExtension) => {
  var fileRelative = file.relative;
  
  if (reviseExtension) fileRelative = _getRevisedFileExtension(file.relative);

  return _path2.default.join(distPath, fileRelative);
}

const _getRevisedFileExtension = (fileName) => {
  return fileName.replace('.tsx', '.js').replace('.ts', '.js');
}

export default {compile};