/** @flow */

/**
 * Checks whether the string start with on the options specified.
 * @name startsWithOneOf
 * @param {string} str string to check.
 * @param {Array} options options to start with
 * @returns {bool} whether the string starts with one of the options.
 * @example
 * startsWithOneOf('hello', ['h', 'afdsf']) // => true
 * startsWithOneOf('hello', ['g', 'afdsf']) // => false
 */
export default function startsWithOneOf(str: string, options: Array): bool {
    if (!str || !options || !Array.isArray(options) || options.length == 0) {
        return false;
    }

    let found = false;

    options.forEach(o => {
        if (str.startsWith(o)) {
            found = true;
        }
    });

    return found;
  };