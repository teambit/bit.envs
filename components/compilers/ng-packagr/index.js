// implicit dependencies made explicit 
import '@angular/compiler'
import '@angular/compiler-cli'
import '@angular/core'
import 'ng-packagr'

import path from 'path'
import {default as execa} from 'execa'

import {writeFileSync, readFileSync} from 'fs';
// import {writeFileSync, readFileSync, unlinkSync} from 'fs';

import readdir from 'recursive-readdir'
import Vinyl from 'vinyl';

const os = require('os')

const compile = async (files, distPath, context) => {
    const mainFile = context.componentObject.mainFile
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`
    const directory = path.join(os.tmpdir(), uuidHack );
    console.log('ahoy')
    // await execa(
    //    'bd', ['isolate', 
    //             '-d', directory, 
    //             '-w', 'true', 
    //             context.componentObject.name, 
    //             '--use-capsule']
    // )

    const res = await context.isolate(directory)
    const capsule = res.capsule
    
    const dependencies = Object
                            .keys(context.componentObject.dependencies)
                            .concat(Object.keys(context.componentObject.packageDependencies))
    const info = {
        main: mainFile,
        dist: distPath, 
        name:context.componentObject.name, 
        dependencies,
        capsule
    }
    const ngPackge = createPackagrFile(directory, info)
    await runNGPackagr(ngPackge)
    const compiledFiles = await collectDistFiles(directory, info)
    capsule.destroy()
    const mainDistFile = path.join('dist', info.name,'esm2015', path.basename(mainFile))
    console.log('\nmain dist file: ', mainDistFile)
    return compiledFiles
}

export async function collectDistFiles(directory, info) {
    const capsuleDir = getFullCapsuleDir(directory, info.name)
    
    const compDistDir = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistDir)
    return files.map((file) => { 
        return new Vinyl({
            path: path.join(`${info.name}`, file.split(path.join(capsuleDir, 'dist'))[1]),
            contents: readFileSync(file)
        })
    })
}

async function runNGPackagr(ngPackge) {
    let result = null
    const scriptFile = path.resolve(require.resolve('ng-packagr/cli/main'))
    try {
        result = await execa('node', [scriptFile, '-p', ngPackge])
    } catch (e) {
        console.log('Error in packaging component:', e)
        throw e
    }
    return result
}

function createPackagrFile(capsuleDir, info) {
    const compDir = getFullCapsuleDir(capsuleDir, info.name)
    const content = `{
        "$schema": "https://raw.githubusercontent.com/ng-packagr/ng-packagr/master/src/ng-package.schema.json",
        "dest": "dist",
        "lib": {
            "entryFile": "${info.main}"
        },
        "whitelistedNonPeerDependencies":[${info.dependencies.map(val => `"${val}"`)}]
    }`
    const filePath = path.resolve(path.join(compDir, 'ng-package.json'))
    writeFileSync(filePath, content)
    return filePath
}

function getFullCapsuleDir(capsuleDir, name) {
    return path.join(capsuleDir, 'components', name) 
}

export default {compile}