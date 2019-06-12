"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasOwnProperty;


/**
 * Determines whether the object has the specified property.
 * @name hasOwnProperty
 * @param {object} obj
 * @param {string|number} prop property to test
 * @returns {boolean}
 * @example
 *  hasOwnProperty({foo: 'bar'}, 'foo') // => true
 *  hasOwnProperty({foo: 'bar'}, 'bar') // => false
 */
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
module.exports = exports["default"];

//# sourceMappingURL=hasOwnProperty.js.map