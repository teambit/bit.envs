# A bit testing environment for mocha and chai.
Bit testing environment for testing of bit components using Mocha and ChaiJS.

## How to use?
import the environment
```bash
bit import bit.envs/testers/mocha -t
```

## What's inside?
- [Mocha](https://mochajs.org)
- [Sinon](http://sinonjs.org)
- [Chai](http://chaijs.com) integrated with Sinon to ease mock assersions using [sinon-chai](https://github.com/domenic/sinon-chai)
- [mockery](https://github.com/mfncooper/mockery) for mocking of package dependencies.