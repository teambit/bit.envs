 # A component bundler for Vue components.
 Compiles and bundles a [Vue](https://vuejs.org) component.
 
 ## How to use?
 
 Import the environment.
 ```bash
  bit import bit.envs/bundlers/vue -c
 ```

 Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
 ```bash
 bit build
 ```
 
 ## What's inside
 - Compiles and bundles using [webpack](https://webpack.js.org/) with [vue-loader](https://github.com/vuejs/vue-loader).
