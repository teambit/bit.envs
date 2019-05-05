# A testing environment for components using karma.

Bit testing environment for testing of components using Karma, with Mocha and ChaiJS.

## How to use?

import the environment
```bash
bit import bit.envs/testers/karma-mocha -t
```

## What's inside?

- [Karma](https://karma-runner.github.io/1.0/index.html) (^1.7.1)
- [Mocha](https://mochajs.org) (^5.0.2)
- [Sinon](http://sinonjs.org) (^3.3.0)
- [Chai](http://chaijs.com) (^4.1.2) integrated with Sinon to ease mock assertions using [sinon-chai](https://github.com/domenic/sinon-chai) (^2.14.0)
- Tests run on `Chrome Headless` browser using [puppeteer](https://github.com/karma-runner/karma-chrome-launcher#headless-chromium-with-puppeteer).

## Reconfiguring this environment

In case the configuration presets in the `karma.conf.js` file of this component are not well suited to your needs, follow [these steps](https://discourse.bit.dev/t/can-i-modify-a-build-test-environments/28) to modify it.

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/bit.envs). Please open an issue or submit pull request there.
