'use strict';

var _chai = require('chai');

var _hasOwnProperty = require('../../src/object/hasOwnProperty');

var _hasOwnProperty2 = _interopRequireDefault(_hasOwnProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mock = { foo: 'bar' };

describe('#hasOwnProperty()', function () {
  it('should return false as given object do not contain key `bar`', function () {
    (0, _chai.expect)((0, _hasOwnProperty2.default)(mock, 'bar')).to.equal(false);
  });

  it('should return true as given object contains key `foo`', function () {
    (0, _chai.expect)((0, _hasOwnProperty2.default)(mock, 'foo')).to.equal(true);
  });

  it('should return false if key is null', function () {
    (0, _chai.expect)((0, _hasOwnProperty2.default)(mock, null)).to.equal(false);
  });
});

//# sourceMappingURL=hasOwnProperty.spec.js.map