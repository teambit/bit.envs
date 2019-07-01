// implicit dependencies made explicit 
import '@angular/compiler'
import '@angular/compiler-cli'
import '@angular/core'
import 'ng-packagr'
import 'typescript'

import path from 'path'
import {default as execa} from 'execa'
import {readFileSync} from 'fs';
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl';
import {promises as fs} from 'fs'
 

const os = require('os')

const FILE_NAME = 'public_api'

const compile = async (files, distPath, context) => {
    const mainFile = context.componentObject.mainFile
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`
    const directory = path.join(os.tmpdir(), uuidHack );
    console.log('\n directory', directory)

    const res = await context.isolate(directory)
    const capsule = res.capsule
    const val = await capsule.exec('npm i tslib')
    const dependencies = context
                            .componentObject.dependencies.map(val => val.id)
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
    await runNGPackagr(ngPackgr, info)
    const dists = await collectDistFiles(info)
    //await capsule.destroy()
    const mainDistFile = path.join(info.name,'esm2015', path.basename(mainFile).replace('.ts', ''))
    return { dists, mainFile: mainDistFile }
}

async function collectDistFiles(info) {
    const capsuleDir = info.directory
    
    const compDistDir = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistDir)
    return files.map((file) => { 
        return new Vinyl({
            path: path.join(`${info.name}`, file.split(path.join(capsuleDir, 'dist'))[1]),
            contents: readFileSync(file)
        })
    })
}

async function runNGPackagr(ngPackge, info) {
    let result = null
    const scriptFile = path.resolve(require.resolve('ng-packagr/cli/main'))
    const cwd = process.cwd()
    try {
        process.chdir(info.directory)
        const args = [scriptFile, '-p ng-package.json -c tsconfig.json']
        console.log(`node ${args.join(' ')}`)
        result = await execa('node', args)
    } catch (e) {
        console.log('\nError in packaging component!\n', e)
        process.chdir(cwd)
        throw e
    }
    process.chdir(cwd)
    return result
}
async function adjustFileSystem(info) {
    const ngPackge = await createPackagrFile(info)
    await createTSConfig(info) 
    return ngPackge
}
async function createPackagrFile(info) {
    const compDir = info.directory
    debugger
    const content = `{
        "$schema": "https://raw.githubusercontent.com/ng-packagr/ng-packagr/master/src/ng-package.schema.json",
        "dest": "dist",
        "lib": {
            "entryFile": "${FILE_NAME}"
        },
        "whitelistedNonPeerDependencies":[${info.dependencies.map(val => `"${val}"`).concat([`"@angular/core"`])}]
    }`
    const filePath = path.resolve(path.join(compDir, 'ng-package.json'))
    await fs.writeFile(filePath, content)
    return filePath
}

function getTSConfigPath(info) {
    return path.join(info.directory, 'tsconfig.json')
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
          "target": "es6",
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
        "exclude": ["node_modules", "dist", "**/*.ngfactory.ts", "**/*.shim.ts", "**/*.spec.ts"],
    }
    return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4))
}
export default { compile }
