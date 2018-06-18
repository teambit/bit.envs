import path from 'path';
import karma from 'karma';
import getFileName from '@bit/bit.utils.file.extract-file-name-from-path';
import isEmptyObject from '@bit/bit.utils.validation.empty';
import readResults from './readResults';
import convertKarmaFormatToBitFormat, {getBrowserFailure} from './resultsAdapter';
require('./karma.conf');

const run = (specFile) => {
  
  const configPath = path.resolve(`${__dirname}${path.sep}karma.conf.js`);
  const karmaConfig = karma.config.parseConfig(configPath, { files: [specFile], port: 9876 } );
  
  var server = new karma.Server(karmaConfig, function(exitCode) {
    console.info('Karma Server has exited with ' + exitCode);
  });

  let runStart;

  server.on('run_start', browsers => {
    runStart = new Date();
  });

  return new Promise((resolve) => {    
    let isBrowserValid = false;
    server.start();

    server.on('browser_register', browsers => {
      isBrowserValid = true;
    });

    server.on('run_complete', (browsers, resultsSummary) => {
      const runEnd = new Date();
      const parsedResults = readResults(getFileName(specFile));

      if (!isBrowserValid) {
        return resolve(getBrowserFailure());
      }

      if (isEmptyObject(parsedResults)) {
        return resolve({});
      }
      
      const adaptedResults = convertKarmaFormatToBitFormat(parsedResults, runStart, runEnd);
      return resolve(adaptedResults);
    });
    
  });
};

export default {run};