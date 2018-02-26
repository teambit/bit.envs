import Vinyl from 'vinyl';
import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import getConfig from './webpack-config';

const runWebpack = (files, distPath) => {
  return new Promise ((resolve, reject) => {
    const fs = new MemoryFS();
    const  webPackConfig = getConfig(files, distPath);
    const outputFiles = [];
    
    // Init webpack with config
    const compiler = webpack(webPackConfig);
    
    // Don't write to file system. Write in-memory instead.
    compiler.outputFileSystem = fs;
    
    compiler.run((err, stats) => {
      if (err) {
          reject(err);
      }

      if (stats.hasErrors()) {
          if (stats.errors && stats.errors.length > 0) {
            reject(stats.errors[0]);
          }
          else if (stats.compilation.errors && stats.compilation.errors.length > 0) {
            reject(stats.compilation.errors[0]);
          }
      }

      fs.readdirSync(distPath).forEach(distFileName => {
        const fileContent = fs.readFileSync(path.join(distPath, distFileName));
        
        outputFiles.push(new Vinyl({
          contents: fileContent,
          base: distPath,
          path: path.join(distPath, distFileName),
          basename: distFileName,
          // TODO: How to recognize spec files properly?
          test: distFileName.indexOf('.spec.') >=0
        }));
      });

      return resolve(outputFiles)
    });
  });
}

const compile = (files, distPath) => {
    if (files.length === 0) {
        return files;
    }
    return runWebpack(files, distPath).then(compiled => {
        return compiled;
    });
}

export default {
  compile
};