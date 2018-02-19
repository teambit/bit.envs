 # Babel-based transpiling environment for Preact components
 Bit build enviroment for transpiling Preact components using Bit.
 
 ## How to use?

 Import the environment.
 ```bash
  bit import bit.envs/compilers/preact -c
 ```

 Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
 ```bash
 bit build
 ```
 
 ## What's inside
 - Compiles `js`, `jsx` and `ts` files.
 - In order to see which babel presets and plugins are used, take a look at the `.babelrc` file.
