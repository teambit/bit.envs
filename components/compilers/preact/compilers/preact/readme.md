# Babel-based transpiling environment for Preact components

Bit build environment for transpiling Preact components using Bit.

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

## Reconfiguring this environment

In case the configuration presets in the `.babelrc` file of this component are not well suited to your needs, follow [these steps](https://discourse.bit.dev/t/can-i-modify-a-build-test-environments/28) to modify it.

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/bit.envs). Please open an issue or submit pull request there.