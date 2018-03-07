import Vinyl from 'vinyl';
import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import configure from './webpack.config';

export const compile = (files, distPath, componentObject) => {
    const mainFile = files.find(file => file.relative === componentObject.mainFile);
    const testFiles = files.filter(file => file.test);  

    return runWebpack(mainFile, testFiles, distPath);
}

const runWebpack = (mainFile, testFiles, distPath) => {
    const conf = getConfig(mainFile, testFiles, distPath);
    const compiler = webpack(conf);

    const fs = new MemoryFS();
    compiler.outputFileSystem = fs;

    const compilationPromise = new Promise(function (resolve, reject) {
        return compiler.run(function (err, stats) {
            if (err || 0 < stats.compilation.errors.length) {
                reject(err || stats.compilation.errors);
                return;
            }

            resolve(stats.compilation.assets);
        });
    });

    return compilationPromise.then((assets) => extractFiles(fs, mainFile, testFiles, distPath, assets));
}

const extractFiles = (fileSystem, mainFile, testFiles, distPath, assets) => {
    const distPathFiles = fileSystem.readdirSync(distPath);

    return Object.keys(assets).map(assetName => {
        const asset = assets[assetName];
        const distFullPath = asset.existsAt;
        return new Vinyl({
            contents: fileSystem.readFileSync(asset.existsAt),
            base: distPath,
            path: distFullPath,
            basename: assetName,
            test:testFiles.find(t => t.basename === assetName) ? true : false
        });
      });
}

const getConfig = (mainFile, testFiles, distPath) => {
    const conf = configure();

    const ext = {
        context: __dirname,
        output: {
            path: path.join(distPath, path.dirname(mainFile.relative)),
        },
        entry: {
            [mainFile.stem] : mainFile.path
        }
    };

    testFiles.forEach(t => ext.entry[t.stem] = [t.path]);

    return Object.assign(conf, ext);
};