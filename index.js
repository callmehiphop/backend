'use strict';

var Response = require('./lib/response');
var mocks = require('./lib/mocks');
var _ = require('./lib/dash');
var backend = module.exports = {};

global.XMLHttpRequest = require('./lib/request');


function when (expected, method, url, data, headers) {
  var mock = mocks.create(method, url, data, headers, expected);
  mock.options = {};

  return {
    respond: function (status, data, headers) {
      mock.response = new Response(status, data, headers);
    },
    passthrough: function() {
      mock.passthrough = true;
    },
    options: function(options) {
      mock.options = options;
      return this;
    }
  };
}

/**
 * Creates a new Mock object
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data
 * @param {object} headers
 * @return {object} respond
 */
backend.when = _.bind(when, backend, false);


/**
 * Creates a new one-time and required Mock object
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data
 * @param {object} headers
 * @return {object} respond
 */
backend.expect = _.bind(when, backend, true);

_.each(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], function(method) {
  backend['expect' + method] = _.bind(when, backend, true, method);
});


backend.verifyNoOutstandingExpectation = function() {
  var expected = mocks.outstandingExpected(mocks);
  if (expected.length) {
    throw new Error('Expected no outstanding expectations, but there were ' + expected.length + '\n' + expected[0].toString());
  }
};


/**
 * Clears out any stubbed requests
 */
backend.clear = function () {
  mocks.clear();
};
