# Deprecated

# A testing environment for React components.
Bit testing environment for testing of React components using Mocha and ChaiJS.

## How to use?
import the environment
```bash
bit import bit.envs/testers/mocha-react -t
```

## What's inside?
- [Mocha](https://mochajs.org)
- [Sinon](http://sinonjs.org)
- [Chai](http://chaijs.com) integrated with Sinon to ease mock assersions using [sinon-chai](https://github.com/domenic/sinon-chai)
- [React test utils](https://facebook.github.io/react/docs/test-utils.html)
- [React Dom](https://facebook.github.io/react/docs/react-dom.html)
- [mocha-jsdom](https://github.com/rstacruz/mocha-jsdom)
- [mockery](https://github.com/mfncooper/mockery) for mocking of package dependencies.
- [enzyme](https://github.com/airbnb/enzyme) for general purpose React testing utilities.
- [teaspoon](https://github.com/jquense/teaspoon) for testing rendered react components.