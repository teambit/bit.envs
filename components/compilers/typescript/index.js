import ts from 'typescript';
import fs from 'fs';
import Vinyl from 'vinyl';
import path from 'path';
import groupBy from '@bit/bit.utils.object.group-by';

const compiledFileTypes = ['tsx', 'ts'];

const compile = (files, distPath, context) => {
    // console.log()
    // console.time('compile')
    // TODO: change to load from tsconfig.json using ts.parseJsonSourceFileConfigFileContent
    const compilerOptions =  {
        module: ts.ModuleKind.CommonJS,
        noEmit: true,
        allowJs: false,
        esModuleInterop: true,
        declaration: true,
        sourceMap: true,
        jsx: 'react',
        target: 'es5',
        incremental: true,
        isolatedModules: true
    
    };

    // Divide files by whether we should compile them, according to file type.
    const filesByToCompile = groupBy(files, _toCompile, context);

    // const compiled = (!filesByToCompile.true || filesByToCompile.true.length === 0) ? [] : filesByToCompile.true.map(file => compileSingleFile(file, compilerOptions, distPath)).reduce((a, b) => a.concat(b));
    // console.time('compileComponent')
    const compiled = (!filesByToCompile.true || filesByToCompile.true.length === 0) ? [] : compileComponent(filesByToCompile.true, compilerOptions, distPath, context)
    // console.timeEnd('compileComponent')
    const nonCompiled = !filesByToCompile.false ? [] : filesByToCompile.false.map(file => _getDistFile(file, distPath, false));
    // console.timeEnd('compile')
    return compiled.concat(nonCompiled);
}

let oldProgram = undefined
export function compileComponent(files, options, path, context) {
    // console.time('create')
    let program = ts.createProgram(files.map(file => file.path), options, undefined, oldProgram);
    oldProgram = program
    // console.timeEnd('create')
    let declarationFile;
    const sources = program.getSourceFile(context.componentObject.mainFile)
    // console.time('emit')
    const emitResults = program.emit(sources, (file, data) => {
        declarationFile = new Vinyl({
            contents: new Buffer(data),
            base: path,
            path: _getDistFilePath({relative:file.split(longestStartingSubstring(file, path))[1]}, path, true).replace('d.js', 'd.ts'),
        });
    },undefined, true);
    // console.timeEnd('emit')

    const results = files.map(file => {
      if (isDefJS(file)) {
        return null
      }
        const result = ts.transpileModule(file.contents.toString(), 
            { 
                compilerOptions: options, 
                fileName: file.basename, 
                moduleName: file.basename.split('.')[0]
            });
        const mappings = new Vinyl({
            contents: new Buffer(result.sourceMapText),
            base: path,
            path: _getDistFilePath(file, path, true),
        });
        mappings.basename = _getRevisedFileExtension(file.basename) + '.map';
        const fileContent = result.outputText ?  new Buffer(`${result.outputText}\n\n//# sourceMappingURL=${result.sourceMapText}`) : new Buffer(result.outputText);
        const distFile = _getDistFile(file, path, true, fileContent);
        return [mappings, distFile, declarationFile];
    })
    .filter((a)=> !!a)
    .reduce((a, b) => a.concat(b), [declarationFile])

    return results
}
const _toCompile = (file) => {
    return compiledFileTypes.indexOf(file.extname.replace('.','')) > -1;// && !file.stem.endsWith('.d');
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

    return path.join(distPath, fileRelative);
}

const _getRevisedFileExtension = (fileName) => {
    return fileName.replace('.tsx', '.js').replace('.ts', '.js');
}

function longestStartingSubstring(left, right) {
    let substring = ''
    if (!right.length || !left.length) {
        return substring
    }
    for (let i = 0; i < left.length; ++i) {
        if (left[i] === right[i]) {
            substring += left[i]
        } else {
            break
        }
    }
    return substring
}
function isDefJS(file) {
  return (typeof file ==='string' ? file: file.path).endsWith('.d.js')
}
export default {compile};