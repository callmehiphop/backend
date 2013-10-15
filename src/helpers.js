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
var props = function(obj) {
  var results = {};

  for (var i in obj) {
    if (has(obj, i) && !isFunction(obj[i])) {
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
 * Generates a simple type check function using the
 * "typeof" operator
 * @param {string} type
 * @return {function} type checker
 */
var isType = function(type) {
  return function(thing) {
    return typeof thing === type;
  }
};


/**
 * Checks to see if supplied thing is of type function
 * @param {mixed} thing - hopefully a function
 * @return {boolean}
 */
var isFunction = isType('function');