import path from 'path'
import execa from 'execa'
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl'
import {promises as fs ,existsSync} from 'fs'
import groupBy from '@bit/bit.utils.object.group-by';

const os = require('os')
const DEBUG_FLAG = 'DEBUG'

const compiledFileTypes = ['ts', 'tsx'];
const tsconfig = require(path.join(__dirname, './tsconfig.json'));

export const compile = (files, distPath, context) => {
    const compilerOptions = tsconfig
    return typescriptCompile(files, distPath, context, {fileTypes: compiledFileTypes, compilerOptions })
}

const typescriptCompile = async (_files, distPath, api, extra) => {
    const { res, directory } = await isolate(api)
    const context = await createContext(res, directory, distPath)

    await createTSConfig(context, extra.compilerOptions) 
    const results = await _compile(context)
  
    if (!process.env[DEBUG_FLAG]) {
        await context.capsule.destroy()
    }

    return results  
}

async function _compile(context) {
    const pathToTSC = require.resolve('typescript/bin/tsc')
    await runNodeScriptInDir(context.directory, pathToTSC, ['-d'])
    const dists = await collectDistFiles(context)
    let mainFile = findMainFile(context, dists)
    return { dists, mainFile}
}
export function findMainFile(context, dists) {
    const getNameOfFile = (val, split) => val.split(split)[0]
    const res = dists.find((val)=> {
        return getNameOfFile(context.main, '.ts') === getNameOfFile(val.basename, '.js')
    })
    return (res || {}).path
}
async function createContext(res, directory, distPath) {
    const componentObject = res.componentWithDependencies.component.toObject()
    return {
        main: componentObject.mainFile,
        dist: distPath,
        name: componentObject.name,
        dependencies: getCustomDependencies(directory),
        capsule:res.capsule,
        directory
    }
}


async function runNodeScriptInDir(directory, scriptFile, args) {
    let result = null
    const cwd = process.cwd()
    try {
        process.chdir(directory)
        result = await execa(scriptFile, args)
    } catch (e) {
        process.chdir(cwd)
        throw e
    }
    process.chdir(cwd)
    return result
}


function createTSConfig(context, content) {
    const pathToConfig = getTSConfigPath(context)
    content.compilerOptions.outDir = 'dist'
    return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4))
}

//@TODO refactor out of here and share with angular compiler.
async function isolate(api) {
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`
    const targetDir = path.join(os.tmpdir(),'bit', uuidHack)
    const componentName = api.componentObject.name
    print(`\n building ${componentName} on directory ${targetDir}`)
    
    const res = await api.isolate({ targetDir, shouldBuildDependencies: true })
    
    return { res, directory: targetDir }
}

async function collectDistFiles(context) {
    const capsuleDir = context.directory
    const compDistDir = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistDir)
    const readFiles = await Promise.all(files.map(file => {
        return fs.readFile(file)
    }))
    return files.map((file, index) => { 
        return new Vinyl({
            path: path.join(context.name, file.split(path.join(capsuleDir, 'dist'))[1]),
            contents: readFiles[index]
        })
    })
}

function getTSConfigPath(context) {
    return path.join(context.directory, 'tsconfig.json')
}

function getCustomDependencies(dir) {
    return Object.keys(require(`${dir}/package.json`).dependencies || {})
}

function print(msg){
    process.env[DEBUG_FLAG] && console.log(msg)
}
