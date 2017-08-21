/**
 * # A Component compiler for TypeScript.
 * Compiles a component for [TypeScript](https://www.typescriptlang.org/).
 * 
 *  ## How to use?
 * 
 * Import the environment
 * ```bash
 *  bit import bit.envs/compilers/typescript -c
 * ```
 * @bit
 */

const ts = require('typescript');
const camelcase = require('camelcase');

/***
 * Compiles TypeScript code to Javascript
 * @name compile
 * @param source
 * @return {{code: string, mappings: string}}
 */
function compile(source) {
  const compilerOptions =  {
    module: ts.ModuleKind.CommonJS,
    sourceMap: true
  };
  const result = ts.transpileModule(source, { compilerOptions });

  return { code: result.outputText, mappings: result.sourceMapText };
}

/***
 * Returns a TypeScript template for writing a new component
 * @name getTemplate
 * @param {string} name Component name
 * @return {string}
 */
function getTemplate(name) {
  return `/**
 * please add your description here...
 * @name component-name
 * @param {type} name
 * @returns {type}
 * @example
 *
 */
export function ${camelcase(name)}() {

}`;
}

module.exports = {
  compile,
  getTemplate
};