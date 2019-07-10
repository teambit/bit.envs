// implicit dependencies made explicit 
import '@angular/compiler'
import '@angular/compiler-cli'
import '@angular/core'
import 'ng-packagr'
import 'typescript'
import 'tslib'

import path from 'path'
import execa from 'execa'
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl'
import {promises as fs ,existsSync} from 'fs'

const os = require('os')

const FILE_NAME = 'public_api'

const compile = async (files, distPath, context) => {
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`
    const directory = path.join(os.tmpdir(), uuidHack );
    const componentName = context.componentObject.name;
    console.log(`\n building ${componentName} on directory ${directory}`)
    
    const res = await context.isolate({targetDir: directory, shouldBuildDependencies:true})
    const componentObject = res.componentWithDependencies.component.toObject()
    const mainFile = componentObject.mainFile
    const capsule = res.capsule
    const val = await capsule.exec('npm i tslib')
    // const dependencies = context
    //                         .componentObject.dependencies.map(val => val.id)
    //                         .concat(Object.keys(context.componentObject.packageDependencies))
    const dependencies = getCustomDependencies(directory)
    if (!~dependencies.indexOf('@angular/core')) {
        await capsule.exec('npm i @angular/core')
    }

    const info = {
        main: mainFile,
        dist: distPath, 
        name: componentObject.name, 
        dependencies,
        capsule,
        directory
    }
    const ngPackgr = await adjustFileSystem(info)
    await runNGPackagr(ngPackgr, info)
    const dists = await collectDistFiles(info)
    //await capsule.destroy()
    const packageJson = getPackageJsonObject(dists, info.name)
    // const mainDistFile = path.join(info.name,'esm2015', path.basename(mainFile).replace('.ts', ''))
    const {main} = packageJson
    delete packageJson.main
    console.log('main is: ', main)
    return { dists, mainFile: main, packageJson}
}

async function collectDistFiles(info) {
    const capsuleDir = info.directory
    
    const compDistDir = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistDir)
    const readFiles = await Promise.all(files.map(file => {
        return fs.readFile(file)
    }))
    return files.map((file, index) => { 
        return new Vinyl({
            path: path.join(info.name, file.split(path.join(capsuleDir, 'dist'))[1]),
            contents: readFiles[index]
        })
    })
}

async function runNGPackagr(ngPackge, info) {
    let result = null
    const scriptFile = path.resolve(require.resolve('ng-packagr/cli/main'))
    const cwd = process.cwd()
    try {
        process.chdir(info.directory)
        // console.log('cwd: ', process.cwd())
        result = await execa(`node`, [scriptFile,`-p`, `ng-package.json`, `-c`, `tsconfig.json`])
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
    await createPublicAPIFile(info)
    await createTSConfig(info) 
    return ngPackge
}

async function createPackagrFile(info) {
    const compDir = info.directory
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
            "strictMetadataEmit": false,
            "fullTemplateTypeCheck": false,
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

function getPackageJsonObject(dists, name) {
    const pkgJsonRaw = dists.find(function(e){return e.basename === 'package.json'})
    const pkgJson = JSON.parse(pkgJsonRaw.contents.toString())
    const keysToTransform = ['es2015', 'esm5', 'esm2015', 'fesm5', 'fesm2015', 'main', 'module', 'typings']
    
    return keysToTransform.reduce((acc, key) => {
        // Special case for main to remove the dist, since bit will add it himself
        if (key === 'main'){
            acc[key] = pkgJson[key];
            if (pkgJson[key].startsWith('dist')) {
                acc[key] = pkgJson[key].replace(/^dist/g, (name))
            }
        } else {
            acc[key] = pkgJson[key].startsWith('dist') 
                ? pkgJson[key].replace(/^dist/g, path.join('dist', name))
                : path.join('dist', name, pkgJson[key])
            }
        return acc
    }, {})
}

function createPublicAPIFile(info) {
    const pathToPublicAPI = path.resolve(info.directory, FILE_NAME)
    if(existsSync(`${pathToPublicAPI}.ts`)) {
        return
    }
    const relativePathContent = path.relative(info.directory, path.join(info.directory, info.main.split('.ts')[0]))
    const content = `export * from '.${path.sep}${relativePathContent}'`
    return fs.writeFile(`${pathToPublicAPI}.ts`, content)
}

function getCustomDependencies(dir) {
    return Object.keys(require(`${dir}/package.json`).dependencies || {})
}

export default { compile }