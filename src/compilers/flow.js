/**
 * # Babel-based transpiling environment.
 * Bit build environment for transpiling using Bit.
 *
 * ## How to use?
 *
 * Import the environment
 * ```bash
 *  bit import bit.envs/compilers/babel -c
 * ```
 *
 * ## What's inside
 * - Babel with [babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/).
 * @bit
 */
require('babel-preset-latest');
require('babel-plugin-transform-flow-strip-types');
require('babel-plugin-transform-object-rest-spread');
require('babel-plugin-add-module-exports');
const babel = require('babel-core');
const Vinyl = require('vinyl');
const path = require('path');

function runBabel(file, options, distPath) {
  const { code, map } = babel.transform(file.contents.toString(), options);
  
  const mappings =  new Vinyl({
    contents: new Buffer(map.mappings),
    base: distPath,
    path: path.join(distPath, file.relative),
    basename: file.basename + '.map'
  });

  let distFile = file.clone();
  distFile.base = distPath;
  distFile.path = path.join(distPath, file.relative);
  distFile.contents = code ?  new Buffer(`${code}\n\n//# sourceMappingURL=${mappings.basename}`) : new Buffer(code);
  
  return [mappings,distFile];
}
function compile(files, distPath) {
  const options = {
    presets: [require.resolve('babel-preset-latest')],
    sourceMaps: true,
    ast: false,
    minified: false,
    plugins: [require.resolve('babel-plugin-transform-flow-strip-types'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-add-module-exports')]
  };

  try {
    return files.map(file=>runBabel(file, options, distPath)).reduce((a,b) => a.concat(b))
  } catch (e) {
    throw e;
  }
}

module.exports = {
  compile,
};