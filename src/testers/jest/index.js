import jest from 'jest';
import path from 'path';
import extractFileNameFromPath from '@bit/bit.utils.file.extract-file-name-from-path';
import {exec} from 'child-process-promise';
import convertJestFormatToBitFormat, {getJestFailure} from './resultsAdapter';
import readResults from './readResults';
import upath from 'upath';

//enforce jsdom dependency, so we'd get ~11.11.0, and avoid the fatal localStorage bug in 11.12.0
import 'jsdom'; 


const run = (specFile) => {
    const convertedSpecFile = upath.normalize(specFile)
    const resultsFilePath = `${extractFileNameFromPath(specFile)}-results.json`;
    const jestPath = path.normalize(`${__dirname}${path.sep}..${path.sep}node_modules${path.sep}jest${path.sep}bin${path.sep}jest.js`);

    // We are using outputFile flag because in some cases when using --json only
    // There is not valid json return, see details here:
    // https://github.com/facebook/jest/issues/4399
    
    var cmd = '"' + process.execPath + '" ' + jestPath + ' ' + convertedSpecFile + ` --rootDir=${require('path').dirname(specFile)} --config=${__dirname}/jest.config.js --json --outputFile="` + resultsFilePath + '"';
    return exec(cmd).then(({err, stdout, stderr}) => {
    const parsedResults = readResults(resultsFilePath);
    return convertJestFormatToBitFormat(parsedResults);
  }).catch(({message, stdout, stderr}) =>{
    // We can arrive here for two reasons:
    // 1. Testing is finished with errors, and then we want to parse the error from the results
    // 2. Error in testing process, and then we parse the catch error.
    try {
      const parsedResults = readResults(resultsFilePath);
      return convertJestFormatToBitFormat(parsedResults);
    }
    catch(err) {
      return getJestFailure(message);
    }
  });
}

export default {
  run,
  globals: {
    jest
  },
  modules: {
    jest
  }
};