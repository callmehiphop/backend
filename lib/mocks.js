'use strict';

var _ = require('./lodash.custom');
var Mock = require('./mock');
var stubs = [];
var mocks = module.exports = {};

/**
 * Factory for Mock object
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data
 * @param {object} headers
 * @return {mock}
 */
mocks.create = function (method, url, data, headers) {
  stubs.push(new Mock(method, url, data, headers));

  return stubs[stubs.length - 1];
};

mocks.remove = function (mock) {
  var idx = mocks.indexOf(mock);
  if (idx !== -1) {
    mocks.splice(idx, 1);
  }
};

/**
 * Clears out any stubs
 */
mocks.clear = function () {
  stubs.length = 0;
};

/**
 * Checks to see if any of the current mock requests match
 * the specified criteria
 * @param {object} xhr stuff
 * @return {mock|boolean}
 */
mocks.match = function (method, url, params, headers) {
  var match = false;

  _.each(stubs, function (mock) {
    if (mock.match(method, url, params, headers) && (match = mock)) {
      return false;
    }
  });

  return match;
};
