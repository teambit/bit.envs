import path from 'path';

/**
@name extractFileNameFromPath
@description Recieves a file path and returns the file name
@param {string} filePath
@returns {string}
*/
export default function(filePath) {
    let fileName = filePath.split(path.sep).pop();
    return fileName.substring(0, fileName.lastIndexOf('.'));
}
