/**
 * Shorthand slice, should be used with .call
 * slice.call(['red', 'blue'], 1);
 */
var slice = Array.prototype.slice;


/**
 * Iterates over an array of things
 * returning false breaks the loop
 * @param {array} things
 * @param {function} callback
 * @param {object} context - optional
 */
var each = function(things, callback, context) {
  for (var i = 0; i < things.length; i++) {
    if (callback.call(context || this, things[i], i, things) === false) {
      break;
    }
  }
};


/**
 * Quick shallow copy of one object to another
 * @param {object} target
 * @param {object} object(s) to extend
 * @return {object} target
 */
var extend = function(target) {
  each(slice.call(arguments, 1), function(obj) {
    for (var key in obj) {
      target[key] = obj[key];
    }
  });

  return target;
};


/**
 * Because I hate typing out obj.hasOwnProperty!
 * I'm lazy for reals
 * @param {object} obj
 * @param {string} key
 * @return {boolean}
 */
var has = function(obj, key) {
  return obj.hasOwnProperty(key);
};


/**
 * Picks out specified properties of an object
 * @param {object} obj
 * @param {array} keys
 * @return {object} results
 */
var pick = function(obj, keys) {
  var results = {};
  
  each(keys, function(key) {
    if (has(obj, key)) {
      results[key] = obj[key];
    }
  });

  return results;
};


/**
 * Grabs all properties of an object
 * @param {object} obj
 * @return {object} results
 */
var props = function(obj, falseys) {
  var results = {};

  for (var i in obj) {
    if (!isFunction(obj[i]) && (!falseys || obj[i])) {
      results[i] = obj[i];
    }
  }

  return results;
};


/**
 * Because I really hate having to pass in
 * the object I'm calling apply from
 * @param {object} obj
 * @param {string} method
 * @param {array} args
 * @param {object} context - optional
 * @return {mixed}
 */
var apply = function(obj, method, args, context) {
  return obj[method].apply(context || obj, args);
};


/**
 * Retrieves ALL keys from a supplied object
 * @param {object} obj
 * @return {array} keys
 */
var keys = function(obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};


/**
 * Merges two arrays into one without disrupting
 * the originals.
 * @param {array} arr1
 * @param {array} arr2
 * @return {array} result
 */
var merge = function(arr1, arr2) {
  var result = arr1.slice(0);

  each(arr2, function(thing) {
    if (!~result.indexOf(thing)) {
      result.push(thing);
    }
  });

  return result.sort();
};


/**
 * Checks to see if two objects are the same, this is
 * probably super lazy, but meh
 * @param {object} a
 * @param {object} b
 * @return {boolean}
 */
var equals = function(a, b) {
  if (!isObject(a)) {
    return a === b;
  }

  var props = merge(keys(a), keys(b));
  var isEqual = true;

  each(props, function(prop) {
    if (a[prop] !== b[prop]) {
      if ((!isObject(a[prop]) && !isObject(b[prop])) || !equals(a[prop], b[prop])) {
        return isEqual = false;
      }
    }
  });

  return isEqual;
};


/**
 * Generates a simple type check function using the
 * "typeof" operator
 * @param {string} type
 * @return {function} type checker
 */
var isType = function(type) {
  return function(thing) {
    return typeof thing === type;
  };
};


/**
 * Checks to see if supplied thing is of type function
 * @param {mixed} thing - hopefully a function
 * @return {boolean}
 */
var isFunction = isType('function');


/**
 * Checks to see if supplied thing is of type object
 * @param {mixed} thing - hopefully an object
 * @return {boolean}
 */
var isObject = isType('object');


/**
 * Checks to see if the supplied thing is of type number
 * @param {mixed} thing - hopefully a number
 * @return {boolean}
 */
var isNumber = isType('number');


/**
 * Checks to see if the supplied thing is of type string
 * @param {mixed} thing - hopefully a string
 * @return {boolean}
 */
var isString = isType('string');


/**
 * Turns a shallow object into serialized data
 * @param {object} obj
 * @return {string} results
 */
var serialize = function(obj) {
  var results = '';

  for (var i in obj) {
    results += i + '=' + obj[i] + '&';
  }

  return results.slice(0, results.length -1);
};


/**
 * Turns serialized data into a shallow object
 * @param {string} str
 * @return {object} results
 */
var deserialize = function(str) {
  var results = {};

  str.replace(
    new RegExp('[^?=&]+)(=[^&]*))?', 'g'),
    function($0, $1, $2, $3) { results[$1] = $3; }
  );

  return results;
};