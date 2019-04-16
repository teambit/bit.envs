import { expect } from 'chai';
import empty from '../../src/validation/empty';

describe('#empty()', () => {
  it('should return true as an empty array was passed', () => {
    expect(empty([])).to.equal(true);
  });

  it('should return true as an empty object was passed', () => {
    expect(empty({})).to.equal(true);
  });

  it('should return true as an empty string was passed', () => {
    expect(empty('')).to.equal(true);
  });

  it('should return false as string `foo` was passed', () => {
    expect(empty('foo')).to.equal(false);
  });

  it('should return false as [1] was passed', () => {
    expect(empty([1])).to.equal(false);
  });

  it('should return false as { a: 1 } was passed', () => {
    expect(empty({ a: 1 })).to.equal(false);
  });
});