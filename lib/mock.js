'use strict';

var _ = require('./lodash.custom');

/**
 * Creates a new Mock object, used to return the desired response
 * for supplied request information
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data (optional)
 * @param {object} headers (optional)
 */
var Mock = module.exports = function Mock (method, url, data, headers) {
  this.method = method.toUpperCase();
  this.url = url instanceof RegExp ? url : routeToRegExp(url);
  this.data = data;
  this.headers = headers;
};

/**
 * Checks to see if the current Mock matches the supplied
 * request information
 * @param {string} method
 * @param {string} url
 * @param {object} data
 * @param {object} headers
 * @return {boolean}
 */
Mock.prototype.match = function match (method, url, data, headers) {
  if (this.url.test(url)) {
    if (this.method === method.toUpperCase()) {
      // can't do equals(), as jQuery will add extra headers
      if (!this.headers || _.contains(headers, this.headers)) {
        if (_.isEqual(this.data, data)) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Route Stuff! (All stolen from Backbone!)
 */
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

/**
 * Converts a dynamic URL string into a Regular Expression
 * e.g. '/posts/:postId/author' becomes /^/posts/([^/]+)/author$/
 * @param {string} route
 * @return {regexp} route
 */
function routeToRegExp (route) {
  route = route.replace(escapeRegExp, '\\$&').
    replace(optionalParam, '(?:$1)?').
    replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
    }).
    replace(splatParam, '(.*?)');

  return new RegExp('^' + route + '$');
}
