# Webpack bundler

A component [compiler](https://docs.bitsrc.io/docs/ext-compiling.html) that bundles the component using [webpack](https://webpack.js.org/) v4.0.1.

## What is bundled?
The bundler bundles the component's main file and test files.
In case there are component files that are not in those files' dependency trees, they won't be bundled. Note that this is in accordance with webpack's usual behavior, but not in accordance with the usual behavior of Bit compilers, which usually compile all the files.

## How to use?
 
 Import the environment.
 ```bash
  bit import bit.envs/bundlers/webpack -c
 ```

 Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
 ```bash
 bit build
 ```