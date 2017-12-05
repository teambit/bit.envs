require('babel-preset-latest')
require("babel-plugin-transform-object-rest-spread");
require('babel-plugin-transform-decorators-legacy');
require('babel-plugin-transform-object-entries');
require('babel-plugin-object-values-to-object-keys');
require('babel-plugin-add-module-exports');
require('babel-plugin-transform-async-to-generator');

const babel = require('babel-core');
const Vinyl = require('vinyl');
const path = require('path');
const groupBy = require('lodash.groupby');

const compiledFileTypes = ['js', 'jsx', 'ts'];

function runBabel(file,options, distPath) {
  const { code, map } = babel.transform(file.contents.toString(), options);

  const mappings = new Vinyl({
    contents: new Buffer(map.mappings),
    base: distPath,
    path: path.join(distPath, file.relative),
  });
  mappings.basename = file.basename + '.map';

  const fileContent = code ?  new Buffer(`${code}\n\n//# sourceMappingURL=${mappings.basename}`) : new Buffer(code);
  const distFile = _getDistFile(file, distPath, fileContent);
  
  return [mappings,distFile];
}

function compile(files, distPath) {
  const options = {
    presets: [require.resolve('babel-preset-latest')],
    sourceMaps: true,
    ast: false,
    minified: false,
    plugins: [require.resolve("babel-plugin-transform-object-rest-spread"),
    require.resolve('babel-plugin-transform-decorators-legacy'),
    require.resolve('babel-plugin-transform-object-entries'),
    require.resolve('babel-plugin-object-values-to-object-keys'),
    require.resolve('babel-plugin-add-module-exports'),
    require.resolve('babel-plugin-transform-async-to-generator')]        
  };

  // Divide files by whether we should compile them, according to file type.
  const filesByToCompile = groupBy(files, _toCompile);
  
  const compiled = (!filesByToCompile.true || filesByToCompile.true.length === 0) ? [] : filesByToCompile.true.map(file => runBabel(file, options, distPath)).reduce((a, b) => a.concat(b));
  const nonCompiled = !filesByToCompile.false ? [] : filesByToCompile.false.map(file => _getDistFile(file, distPath));
  
  return compiled.concat(nonCompiled);;
}

const _toCompile = (file) => {
  return compiledFileTypes.indexOf(file.extname.replace('.','')) > -1;
}

const _getDistFile = (file, distPath, content) => {
  let distFile = file.clone();
  distFile.base = distPath;
  distFile.path = path.join(distPath, file.relative);

  if (content) {
    distFile.contents = content;
  }

  return distFile;
}

module.exports = {
  compile,
};