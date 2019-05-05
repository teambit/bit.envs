# Webpack bundler

A component [compiler](https://docs.bitsrc.io/docs/ext-compiling.html) that bundles the component using [webpack](https://webpack.js.org/) ^v4.0.1.

## What is bundled?
The bundler bundles the component's main file and test files.
In case there are component files that are not in those files' dependency trees, they won't be bundled. Note that this is in accordance with webpack's usual behavior, but not in accordance with the usual behavior of Bit compilers, which usually compile all the files.

## How to use?

Import the environment.
```bash
bit import bit.envs/bundlers/webpack-css-modules -c
```

Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
```bash
bit build
```

## What's inside
- js/jsx compiling using the following babel presets babelPresetReact, babelPresetEs2015, stage0
- [s]css support using style-loader and css-loader
- css modules
- mp4|webm|wav|mp3|m4a|aac|oga support using url-loader
- svg support using svg-inline-loader

## Reconfiguring this environment

In case the configuration presets in the `webpack.config.js` file of this component are not well suited to your needs, follow [these steps](https://discourse.bit.dev/t/can-i-modify-a-build-test-environments/28) to modify it.

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/bit.envs). Please open an issue or submit pull request there.