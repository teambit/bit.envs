import Vinyl from 'vinyl';
import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import configure from './webpack.config';

const compiledFileTypes = ['js', 'jsx', 'ts', 'tsx'];

function compile(files, distRootPath, context) {
  let mainFile = files.find(file => file.relative === context.componentObject.mainFile);
  const testFiles = files.filter(x => x.test);
  const toCompile = _toCompile(mainFile);
  if (toCompile) {
    return runWebpack(mainFile, distRootPath, testFiles);
  } 
  const distsFiles = files.map(file => {
    return _getDistFile(file, distRootPath)
  })

  return distsFiles;
}

function _getDistFile(file, distPath, content){
  let distFile = file.clone();
  distFile.base = distPath;
  distFile.path = path.join(distPath, file.relative);

  if (content) {
    distFile.contents = content;
  }

  return distFile;
}

function _toCompile(file) {
  return compiledFileTypes.indexOf(file.extname.replace('.','')) > -1;
}

function runWebpack(mainFile, distRootPath, testFiles) {
  var conf = getConfig(mainFile, distRootPath, testFiles);
  var compiler = webpack(conf);
  
  var fs = new MemoryFS();
  compiler.outputFileSystem = fs;
  
  var compilationPromise = new Promise(function (resolve, reject) {
    return compiler.run(function (err, stats) {
      if (err || 0 < stats.compilation.errors.length) {
        console.log(err || stats.compilation.errors)
        reject(err || stats.compilation.errors);
        return;
      }
      
      resolve(stats.compilation.assets);
    });
  });
  
  return compilationPromise.then((assets) => extractFiles(fs, mainFile, distRootPath, testFiles, assets));
}

function extractFiles(fileSystem, mainFile, distRootPath, testFiles, assets) {
  var distPathFiles = fileSystem.readdirSync(distRootPath);
  
  return Object.keys(assets).map(assetName => {
    const asset = assets[assetName];
    const distFullPath = asset.existsAt;
    return new Vinyl({
      contents: fileSystem.readFileSync(asset.existsAt),
      base: distRootPath,
      path: distFullPath,
      basename: assetName,
      test:testFiles.find(x => x.basename === assetName ) ? true : false
    });
  })
}

function getConfig(mainFile, distRootPath, testFiles) {
  const conf = configure();
  conf.context = __dirname;
  conf.output.path = path.join(distRootPath, path.dirname(mainFile.relative));
  conf.entry = {
    [mainFile.stem] : mainFile.path
  }
  testFiles.forEach(x=>conf.entry[x.stem] = [x.path])
  conf.library;
  
  return conf;
};


module.exports = {
  compile
};