/** @flow */
import hasOwnProperty from '../object/hasOwnProperty';

/**
 * determines whether `obj` reference is empty (empty array, empty object and/or falsy values)
 * @name empty
 * @param {*} name
 * @returns {boolean}
 * @example
 *  empty([]) // => true
 *  empty({}) // => true
 *  empty(1) // => false
 *  empty('') // => false
 *  empty('foo') // => false
 *  empty(false) // => true
 */
export default function isEmpty(obj: any): boolean {
  for (const n in obj) if (hasOwnProperty(obj, n) && obj[n]) return false; // eslint-disable-line
  return true;
};