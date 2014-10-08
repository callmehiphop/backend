'use strict';

var Response = require('./lib/response');
var mocks = require('./lib/mocks');
var backend = module.exports = {};

global.XMLHttpRequest = require('./lib/request');

/**
 * Creates a new Mock object
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data
 * @param {object} headers
 * @return {object} respond
 */
backend.when = function (method, url, data, headers) {
  var mock = mocks.create(method, url, data, headers);

  return {
    respond: function (status, data, headers) {
      mock.response = new Response(status, data, headers);
    }
  };
};


/**
 * Clears out any stubbed requests
 */
backend.clear = function () {
  mocks.clear();
};
