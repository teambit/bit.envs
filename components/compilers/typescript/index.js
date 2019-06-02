import path from 'path';

const compiledFileTypes = ['ts'];
const tsconfig = require(path.join(__dirname, './tsconfig.json'));

const compile = (files, distPath, context) => {
    const compilerOptions = tsconfig
    typescriptCompile(files, distPath,context, {fileTypes: compiledFileTypes, compilerOptions })
}

export default {compile}