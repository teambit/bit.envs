import jest from 'jest';
import path from 'path';
import extractFileNameFromPath from '@bit/bit.utils.file.extract-file-name-from-path';
import {exec} from 'child-process-promise';
import convertJestFormatToBitFormat, {getJestFailure} from './resultsAdapter';
import readResults from './readResults';

const run = (specFile) => {
    const resultsFilePath = `${extractFileNameFromPath(specFile)}-results.json`;
    const jestPath = path.normalize(`${__dirname}${path.sep}..${path.sep}node_modules${path.sep}jest${path.sep}bin${path.sep}jest.js`);
    // We are using outputFile flag because in some cases when using --json only
    // There is not valid json return, see details here:
    // https://github.com/facebook/jest/issues/4399
    const cmd = `"${process.execPath}" ${jestPath} ${specFile} --json --outputFile="${resultsFilePath}"`;
  return exec(cmd).then(({err, stdout, stderr}) => {
    const parsedResults = readResults(resultsFilePath);
    return normalizeResults(parsedResults);
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