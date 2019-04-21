# Babel-based transpiling environment.

Bit build environment for transpiling using Bit.

## How to use?

Import the environment.

If you are using Babel version 7.* - run this command:

```bash
bit import bit.envs/compilers/babel --compiler
```

If you are using Babel version 6.* - run this command:

```bash
bit import bit.envs/compilers/babel@6.0.0 --compiler
```

Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).

```bash
bit build
```

## What's inside

- Compiles `js`, `jsx` and `ts` files.
- In order to see which babel presets and plugins are used, take a look at the `.babelrc` file.

## Babel version
- Minor / patch versions of this compilers is not in sync with the Babel minor / patch versions