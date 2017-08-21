/**
 * # Babel-based transpiling environment for React components
 * Bit build enviroment for transpiling React components using Bit.
 * 
 * ## How to use?
 * 
 * Import the environment
 * ```bash
 *  bit import bit.envs/compilers/react -c
 * ```
 * 
 * ## What's inside
 * - Babel with JSX and [babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/).
 */
const babel = require('babel-core');
const Vinyl = require('vinyl');
const path = require('path');

require('babel-plugin-transform-class-properties');
require('babel-plugin-transform-object-rest-spread');
require('babel-plugin-transform-react-jsx');
require('babel-plugin-transform-regenerator');
require('babel-preset-latest');
require('babel-preset-react');

const plugins = [
  // enable import syntax
  require.resolve('babel-plugin-transform-class-properties'),
  [
    require.resolve('babel-plugin-transform-object-rest-spread'),
    {
      useBuiltIns: true,
    },
  ],
  [
    require.resolve('babel-plugin-transform-react-jsx'),
    {
      useBuiltIns: true,
    },
  ],
  [
    require.resolve('babel-plugin-transform-regenerator'),
    {
      async: false,
    },
  ]
];

const presets = [
  // Latest stable ECMAScript features
  require.resolve('babel-preset-latest'),
  // JSX, Flow
  require.resolve('babel-preset-react')
];

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
    presets: presets,
    sourceMaps: true,
    ast: false,
    minified: false,
    plugins: plugins
  };

  try {
    return files.map(file => runBabel(file, options, distPath)).reduce((a, b) => a.concat(b));
  } catch (e) {
    throw e;
  }
}

function getTemplate() {
  return `/** @flow */
import React, { Component } from 'react';

/**
 * My new and awesome React component
 */
class MyComponent extends Component {

}

module.exports = MyComponent;
`;
}

module.exports = {
  compile,
  getTemplate
};