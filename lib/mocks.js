'use strict';

var _ = require('./dash');
var Mock = require('./mock');
var stubs = [];
var mocks = module.exports = {};

/**
 * Factory for Mock object
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data
 * @param {object} headers
 * @param {bool} expected
 * @return {mock}
 */
mocks.create = function (method, url, data, headers, expected) {
  stubs.push(new Mock(method, url, data, headers, expected));

  return stubs[stubs.length - 1];
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
  for (var match, i = 0; i < stubs.length; i++) {
    if (stubs[i].match(method, url, params, headers)) {
      match = stubs[i];
      if (match.expected) {
        stubs.splice(i, 1);
      }
      return match;
    }
  }

  return false;
};

/**
 * Return any outstanding expected requests
 * @return {array[mock]}
 */
mocks.outstandingExpected = function() {
  var expected = [];
  _.each(stubs, function(mock) {
    if (mock.expected) {
      expected.push(mock);
    }
  });
  return expected;
};
