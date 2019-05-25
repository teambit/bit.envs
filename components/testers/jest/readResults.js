import fs from 'fs';
const readResults = (filePath = 'results.json') => {
    const results = fs.readFileSync(filePath);
    const parsedResults = JSON.parse(results);
    fs.unlinkSync(filePath);
    return parsedResults;
}

export default readResults;