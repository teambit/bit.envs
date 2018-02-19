import fs from 'fs-extra';
import path from 'path';


const getBabelRc = (pathToLook) => {
    const babelRcPath = `${pathToLook}${path.sep}.babelrc`;
    const file = fs.readFileSync(babelRcPath, 'utf8');
    return JSON.parse(file);
}

const addBabelPrefixAndResolve = (prefixType, obj) => {
    if (!obj.startsWith(`babel-${prefixType}`)) {
        obj = `babel-${prefixType}-${obj}`;
      }

      return require.resolve(obj);
} 

/**
 * @name getBabelOptions
 * @description Retrieves the babel options from the `.babelrc` file as JSON  from the specified directory.
 * @param {string} pathToLook 
 * @example
 * const babelOptions = getBabelOptions();
 * babel.transform(code, babelOptions, distPath);
 */
const getBabelOptions = (pathToLook) => {
    const options = getBabelRc(pathToLook);
    options.sourceMaps = true;
    
    options.plugins = options.plugins.map(plugin => {
        if (Array.isArray(plugin)) {
            plugin[0] = addBabelPrefixAndResolve('plugin', plugin[0]);
            return plugin;
        } 
      
        return addBabelPrefixAndResolve('plugin', plugin);
    });
  
    options.presets = options.presets.map(preset => {
        if (Array.isArray(preset)) {
            preset[0] = addBabelPrefixAndResolve('preset', preset[0]);
            return preset;
          } 

        return addBabelPrefixAndResolve('preset', preset);
    });
  
    return options;
  }

export default getBabelOptions;