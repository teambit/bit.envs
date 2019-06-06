

 # Bit compilers, transpilers and testers. 
 
 
<p align="center">
  <a href="https://bit.dev/bit/envs"><img src="https://storage.googleapis.com/bit-docs/Screen%20Shot%202019-06-06%20at%201.26.32%20PM.png"></a>
</p>

[Component collection](https://bit.dev/bit/envs) • [Docs](https://docs.bit.dev/docs/building-components.html)  

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

## License

By contributing to Bit, you agree that your contributions will be licensed
under its [Apache2 license](LICENSE).
