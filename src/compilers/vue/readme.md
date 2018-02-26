 # A component compiler for Vue components.
 Compiles a [Vue](https://vuejs.org) component.
 
 ## How to use?
 
 Import the environment.
 ```bash
  bit import bit.envs/compilers/vue -c
 ```

 Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
 ```bash
 bit build
 ```
 
 ## What's inside
 - Compiles using [webpack](https://webpack.js.org/) with [vue-loader](https://github.com/vuejs/vue-loader).
