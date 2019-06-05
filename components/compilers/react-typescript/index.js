import path from 'path';

const compiledFileTypes = ['tsx', 'ts'];
const tsconfig = require(path.join(__dirname, './tsconfig.json'));

import {typescriptCompile} from '@bit/bit.envs.internal.typescript-base-compiler';

const compile = (files, distPath, context) => {
  const compilerOptions = tsconfig
  return typescriptCompile(files, distPath,context, {fileTypes: compiledFileTypes, compilerOptions })
}

export default {compile};