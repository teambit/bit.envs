import {expect} from 'chai';
import startsWithOneOf from '../../src/string/startsWithOneOf';

describe('starts-with-one-of', () => {
  it('should return true if start with first option', () => {
    const stringToCheck = "and what";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if start with first option', () => {
    const stringToCheck = "and what";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if start with first option', () => {
    const stringToCheck = "and what";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if start with first option', () => {
    const stringToCheck = "and what";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if start with last option', () => {
    const stringToCheck = "dnd what";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if start with option in the middle', () => {
    const stringToCheck = "cnd what";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if starts with single option', () => {
    const stringToCheck = "and what";
    const options = [
        "a"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return false if no options sent', () => {
    const stringToCheck = "and what";

    return expect(startsWithOneOf(stringToCheck)).to.be.false;
  });

  it('should return false if options is empty array', () => {
    const stringToCheck = "and what";
    const options = [];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.false;
  });

  it('should return false if options is not an array', () => {
    const stringToCheck = "and what";
    const options = {a: 'a'};

    return expect(startsWithOneOf(stringToCheck, options)).to.be.false;
  });

  it('should return true if starts with option that is more than one char', () => {
    const stringToCheck = "and what";
    const options = [
        "an"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if starts with option that is more than one word', () => {
    const stringToCheck = "and what";
    const options = [
        "and w"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return true if starts with more than one option', () => {
    const stringToCheck = "and what";
    const options = [
        "an",
        "b",
        "and"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.true;
  });

  it('should return false if string to check is empty', () => {
    const stringToCheck = "";
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.false;
  });

  it('should return false if string to check is undefined', () => {
    const stringToCheck = undefined;
    const options = [
        "a",
        "b",
        "c",
        "d"
    ];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.false;
  });

  it('should return false if string to check is empty and there are no options', () => {
    const stringToCheck = "";
    const options = [];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.false;
  });

  it('should return false if string to check is undefined and there are no options', () => {
    const stringToCheck = undefined;
    const options = [];

    return expect(startsWithOneOf(stringToCheck, options)).to.be.false;
  });
});