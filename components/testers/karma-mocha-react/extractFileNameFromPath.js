module.exports = function(filePath) {
    let fileName = filePath.split('/').pop();
    return fileName.split('.')[0];
}