/**
 * ## normalize
 *
 * Miscellaneous utilities to camel-case strings, etc.
 *
 * @private
 */

var normalize = exports;

/**
 * ## normalize.camelize(s)
 *
 * _Convert non_camel_case to camelCase string_
 *
 * @param {String} s String to convert
 * @return {String} Camel-cased string
 * @private
 */
normalize.camelize = function(s) {
  return s.replace(/_[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
};

/**
 * ## normalize.camelizeKeys(o)
 *
 * _Camel-case keys in an object and return a copy_
 *
 * @param {Object} o Object to process
 * @return {Object} Processed object
 * @private
 */
normalize.camelizeKeys = function camelizeKeys(o) {
  var processed = {};

  if (typeof o !== 'object' || Array.isArray(o)) {
    return o;
  }

  Object.keys(o).forEach(function(key) {
    if (typeof o[key] === 'object') {
      processed[key] = camelizeKeys(o[key]);
    } else {
      processed[key] = normalize.camelize(o[key]);
    }
  });

  return processed;
};
