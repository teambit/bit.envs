import fs from 'fs-extra';
import path from 'path';

/**
 * @name getBabelRc
 * @description Retrieves the `.babelrc` file as JSON  from the specified directory (default is working directory).
 * @param {string} pathToLook 
 * @example
 * const babelOptions = getBabelRc();
 * babel.transform(code, babelOptions, distPath);
 */
const getBabelRc = (pathToLook = __dirname) => {
    const babelRcPath = `${pathToLook}${path.sep}.babelrc`;
    const file = fs.readFileSync(babelRcPath, 'utf8');
    return JSON.parse(file);
}

export default getBabelRc;