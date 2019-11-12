
# Deprecated. Compilers and testers for Bit are now in https://github.com/teambit/envs

## Bit compilers, transpilers and testers. 
 
Bit helps you easily share many components. To save the overhead of separately defining build and test steps for every component, bit lets you use reusable extensions as **compilers** and **testers** for the components in your workspace.  

The component environment is a unique type of an
[extension](https://docs.bit.dev/docs/ext-concepts.html) that implements specific APIs to support
building (compiling/transpiling) components and running unit tests.  

This repository contains officially supported bit compilers and testers for the public use of the developer community.  

**All issues and PRs re Bit compilers and testers should be opened in this repository**.  

## Compilers and testers on bit.dev

All bit compilers and testers are available and can be used from [this bit.dev collection](https://bit.dev/bit/envs).  


## Bit compilers and transpilers

- [React](https://bit.dev/bit/envs/compilers/react)
- [Vue](https://bit.dev/bit/envs/bundlers/vue)
- [TypeScript](https://bit.dev/bit/envs/compilers/typescript)
- [Babel](https://bit.dev/bit/envs/compilers/babel)
- [Flow](https://bit.dev/bit/envs/compilers/flow)
- [React-TypeScript](https://bit.dev/bit/envs/compilers/react-typescript)
- [Preact](https://bit.dev/bit/envs/compilers/preact)
- [Webpack](https://bit.dev/bit/envs/bundlers/webpack)
- [Webpack-CSS-Modules](https://bit.dev/bit/envs/bundlers/webpack-css-modules)

See: "[Which Bit compiler should I use?](https://blog.bitsrc.io/which-bit-compiler-should-i-use-173bea1d9da4)"

## How to use a Bit compiler

See [full documentation on the usage of bit compilers](https://docs.bit.dev/docs/building-components.html#compilers-maintained-by-bitdev).

Bit uses a global compiler configuration for a workspace, which propagates to each component tracks in that workspace. Therefore, can import a single compiler for all the components in your project.

**Example**  
Use the `--compiler` flag when importing a bit compiler.

```
$ bit import bit.envs/compilers/babel --compiler
the following component environments were installed
- bit.envs/compilers/babel@0.0.7
```


## Develop your own Bit compiler/tester

Since there are so many build tools and configurations, some of you might discover that the existing compilers don’t fit their requirements. Compilers are bit components, and anyone can develop a new compiler.

See [developing bit compilers](https://docs.bit.dev/docs/ext-compiling.html).


## Contributing

Contributions are always welcome, no matter how large or small. Before contributing,
please read the [code of conduct](CODE_OF_CONDUCT.md).

## Pull Requests

We actively welcome your pull requests.

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Add your change to the CHANGELOG.md file at the [unreleased] section.

## Running this project
1. clone
2. make sure the local scope name is different then bit.envs to prevent collision with bit.dev scope name. (either change the name inside `.git/bit/scope.json` or make sure to clone to a folder other than `bit.envs` (the default scope name is the same as the dir name))
1. `bit import` (it takes some time)
1. `npm i`
1. `bit import --merge`
1. `bit link`
1. validate by running `bit status` and make sure everything is ok

## License

By contributing to Bit, you agree that your contributions will be licensed
under its [Apache2 license](LICENSE).
