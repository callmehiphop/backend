'use strict';

var _ = require('./dash');
var globToRegExp = require('glob-to-regexp');

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
  this.url = url instanceof RegExp ? url : globToRegExp(url);
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
      if (!this.headers || _.isMatch(headers, this.headers)) {
        if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            }
            catch (e) {}
        }

        if (!this.data || _.isEqual(this.data, data)) {
          return true;
        }
      }
    }
  }

  return false;
};
