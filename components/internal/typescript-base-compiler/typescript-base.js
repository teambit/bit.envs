import ts from 'typescript';
import Vinyl from 'vinyl';
import path from 'path';
import groupBy from '@bit/bit.utils.object.group-by';

export function typescriptCompile(files, distPath, context, extra) {
    const filesByToCompile = groupBy(files, _toCompile(extra.fileTypes), context);
    
    const compiled = (!filesByToCompile.true || filesByToCompile.true.length === 0) ? [] : compileComponent(filesByToCompile.true, extra.compilerOptions, distPath, context)
    const nonCompiled = !filesByToCompile.false ? [] : filesByToCompile.false.map(file => _getDistFile(file, distPath, false));
    return compiled.concat(nonCompiled);
}

let oldProgram = undefined
function compileComponent(files, options, path, context) {
    
    let program = ts.createProgram(files.map(file => file.path), options, undefined, oldProgram);
    oldProgram = program
    const sources = program.getSourceFile(context.componentObject.mainFile)
    
    let declarationFile;
    program.emit(sources, (file, data) => {
        declarationFile = new Vinyl({
            contents: new Buffer(data),
            base: path,
            path: _getDistFilePath({relative:file.split(longestStartingSubstring(file, path))[1]}, path, true)
            .replace('d.js', 'd.ts'),
        });
    },undefined, true);
    
    const results = files.map(file => {
        if (isDefJS(file)) {
            return null
        }
        const result = ts.transpileModule(file.contents.toString(), 
        { 
            compilerOptions: options.compilerOptions, 
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
const _toCompile = (compiledFileTypes) => (file) => {
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
    
    return path.join(distPath, fileRelative);
}

const _getRevisedFileExtension = (fileName) => {
    return fileName.replace('.tsx', '.js').replace('.ts', '.js');
}

/**
 * Find longest common substring in 2 strings.
 * Used for calculate the longset common path
 * @param {*} left 
 * @param {*} right 
 */
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
