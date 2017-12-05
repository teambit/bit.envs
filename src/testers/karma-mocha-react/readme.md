# A testing environment for React components using karma.
Bit testing environment for testing of React components using Karma, with Mocha and ChaiJS.

## How to use?
import the environment
```bash
bit import bit.envs/testers/karma-mocha-react -t
```

## What's inside?
- [Karma](https://karma-runner.github.io/1.0/index.html)
- [Mocha](https://mochajs.org)
- [Sinon](http://sinonjs.org)
- [Chai](http://chaijs.com) integrated with Sinon to ease mock assertions using [sinon-chai](https://github.com/domenic/sinon-chai)
- [React test utils](https://facebook.github.io/react/docs/test-utils.html)
- [React Dom](https://facebook.github.io/react/docs/react-dom.html)
- [mockery](https://github.com/mfncooper/mockery) for mocking of package dependencies.
- [teaspoon](https://github.com/jquense/teaspoon) for testing rendered react components.
- [enzyme](https://github.com/airbnb/enzyme) for general purpose React testing utilities.