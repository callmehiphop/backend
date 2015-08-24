'use strict';

var Response = require('./lib/response');
var mocks = require('./lib/mocks');
var pending = require('./lib/pending');
var _ = require('./lib/dash');
var backend = module.exports = {
  defaults: {
    delay: 0
  }
};

global.XMLHttpRequest = require('./lib/request');


function when (expected, method, url, data, headers) {
  var mock = mocks.create(method, url, data, headers, expected);
  mock.options = _.extend({}, backend.defaults);

  return {
    respond: function (status, data, headers) {
      mock.response = new Response(status, data, headers);
    },
    passthrough: function() {
      mock.passthrough = true;
    },
    options: function(options) {
      _.extend(mock.options, options);
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

/**
 * Assert that all expected requests have been requested.
 */
backend.verifyNoOutstandingExpectation = function() {
  var expected = mocks.outstandingExpected();
  if (expected.length) {
    throw new Error('Expected no outstanding expectations, but there were ' +
      expected.length + '\n' + expected[0].toString());
  }
};

/**
 * Assert that there are no stubbed requests that are not resolved yet.
 */
backend.verifyNoOutstandingRequest = function() {
  var inFlight = pending.outstanding();
  if (inFlight.length) {
    throw new Error('Expected no outstanding requests, but there were ' +
      inFlight.length + '\n' + inFlight[0].toString());
  }
};

/**
 * Resolves any pending requests syncrounously
 */
backend.flush = function () {
  pending.flush();
};

/**
 * Clears out any stubbed and pending requests
 */
backend.clear = function () {
  mocks.clear();
  pending.clear();
};
