// implicit dependencies made explicit 
import '@angular/compiler'
import '@angular/compiler-cli'
import '@angular/core'
import 'ng-packagr'
import 'typescript'

import path from 'path'
import {default as execa} from 'execa'
import {writeFileSync, readFileSync} from 'fs';
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl';
import {promises as fs} from 'fs'
 

const os = require('os')

const compile = async (files, distPath, context) => {
    const mainFile = context.componentObject.mainFile
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`
    const directory = path.join(os.tmpdir(), uuidHack );
    console.log('\n directory', directory)

    const res = await context.isolate(directory)
    const capsule = res.capsule
    const val = await capsule.exec('npm i @angular/core @angular/common @angular/animations')

    const dependencies = Object
                            .keys(context.componentObject.dependencies)
                            .concat(Object.keys(context.componentObject.packageDependencies))
    const info = {
        main: mainFile,
        dist: distPath, 
        name: context.componentObject.name, 
        dependencies,
        capsule,
        directory
    }
    const ngPackgr = await adjustFileSystem(info)
    await runNGPackagr(ngPackgr, directory)
    const dists = await collectDistFiles(directory, info)
    await capsule.destroy()
    const mainDistFile = path.join(info.name,'esm2015', path.basename(mainFile).replace('.ts', ''))
    return { dists, mainFile: mainDistFile }
}

export async function collectDistFiles(directory, info) {
    const capsuleDir = getFullCapsuleDir(directory)
    
    const compDistDir = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistDir)
    return files.map((file) => { 
        return new Vinyl({
            path: path.join(`${info.name}`, file.split(path.join(capsuleDir, 'dist'))[1]),
            contents: readFileSync(file)
        })
    })
}

async function runNGPackagr(ngPackge, directory) {
    let result = null
    const scriptFile = path.resolve(require.resolve('ng-packagr/cli/main'))

    try {
        result = await execa('node', [scriptFile, '-p', ngPackge, '-c', getTSConfigPath({directory})])
    } catch (e) {
        console.log('\nError in packaging component!\n')
        throw e
    }
    return result
}
export async function adjustFileSystem(info) {
    const ngPackge = createPackagrFile(info.directory, info)
    await mvPackageJSon(info)
    await createTSConfig(info) 
    await createArtificialEntryPoint(info) 
    return ngPackge
}

function createArtificialEntryPoint(info) {
    const pathToEntry = path.join(getFullCapsuleDir(info.directory), 'index.ts')
    const content  = `
        export default './${info.name}/${info.main}';
    `
    fs.writeFile(pathToEntry, content)
}

function createPackagrFile(capsuleDir, info) {
    const compDir = getFullCapsuleDir(capsuleDir)
    const content = `{
        "$schema": "https://raw.githubusercontent.com/ng-packagr/ng-packagr/master/src/ng-package.schema.json",
        "dest": "dist",
        "lib": {
            "entryFile": "index.ts"
        },
        "whitelistedNonPeerDependencies":[${info.dependencies.map(val => `"${val}"`)}]
    }`
    const filePath = path.resolve(path.join(compDir, 'ng-package.json'))
    writeFileSync(filePath, content)
    return filePath
}

function getFullCapsuleDir(capsuleDir) {
    return path.join(capsuleDir, 'components') 
}

function getFullComponentDir(info) {
    return path.join(getFullCapsuleDir(info.directory), info.name)
}

function mvPackageJSon(info) {
    const packageJsonOldPath = path.join(getFullComponentDir(info), 'package.json')
    const packageJsonNewPath = path.join(getFullCapsuleDir(info.directory), 'package.json')  
    return fs.rename(packageJsonOldPath, packageJsonNewPath)
}
function getTSConfigPath(info) {
    return path.join(getFullCapsuleDir(info.directory), 'tsconfig.json')
}

function createTSConfig(info) {
    const pathToConfig = getTSConfigPath(info)
    const content = {
        "angularCompilerOptions": {
          "skipTemplateCodegen": true,
          "strictMetadataEmit": true,
          "fullTemplateTypeCheck": true,
          "enableResourceInlining": true
        },
        "buildOnSave": false,
        "compileOnSave": false,
        "compilerOptions": {
          "baseUrl": ".",
          "target": "ES6",
          "module": "es2015",
          "moduleResolution": "node",
          "outDir": "dist",
          "declaration": true,
          "inlineSourceMap": true,
          "inlineSources": true,
          "skipLibCheck": true,
          "emitDecoratorMetadata": true,
          "experimentalDecorators": true,
          "importHelpers": true,
          "lib": ["dom", "es2018"]
        },
        "exclude": [".dependencies","node_modules", "dist", "**/*.ngfactory.ts", "**/*.shim.ts", "**/*.spec.ts"],
        "include": ["index.ts"]
    }
    return fs.writeFile(pathToConfig, JSON.stringify(content))
}
export default { compile }
