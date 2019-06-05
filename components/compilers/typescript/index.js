import path from 'path';
import {typescriptCompile} from '@bit/bit.envs.internal.typescript-base-compiler';
const compiledFileTypes = ['ts'];
const tsconfig = require(path.join(__dirname, './tsconfig.json'));

const compile = (files, distPath, context) => {
    const compilerOptions = tsconfig
    return typescriptCompile(files, distPath,context, {fileTypes: compiledFileTypes, compilerOptions })
}

export default {compile}