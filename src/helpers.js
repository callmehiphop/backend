var slice = Array.prototype.slice;


/**
 *
 */
var each = function(things, callback, context) {
  for (var i = 0; i < things.length; i++) {
    if (callback.call(context || this, things[i], i, things) === false) {
      break;
    }
  }
};


/**
 *
 */
var extend = function(target) {
  each(slice.call(arguments, 1), function(obj) {
    for (var key in obj) {
      target[prop] = obj[prop];
    }
  });

  return target;
};


/**
 *
 */
var apply = function(obj, method, args, context) {
  return obj[method].apply(context || obj, args);
};


/**
 *
 */
var isType = function(type) {
  return function(thing) {
    return typeof thing === type;
  }
};


/**
 *
 */
var isFunction = isType('function');
