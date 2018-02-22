import path from 'path';
import fse from 'fs-extra';

const readResults = (filePath) => {
    const resultsFilePath = path.resolve(`${__dirname}${path.sep}${filePath}-results.json`);
  
    let parsedResults = {};
  
    try {
      parsedResults = fse.readJsonSync(resultsFilePath);
    }
    catch (e) {
      return {failures: [{title:'Cannot read results file',err:{message:e.message}}]};
    }
  
    try {
      fse.removeSync(resultsFilePath);
    }
    catch (e) {
      console.log('Cannot delete results file: ' + e.message);
    }
  
    return parsedResults;
}

export default readResults;