'use strict';

/**
 * Checks to see if a status code was provided, otherwise defaults
 * it to 200, then creates a function to return all items in an array
 * @param {number} [status]
 * @param {object} data
 * @param {object} headers
 */
var Response = module.exports = function (status, data, headers) {
  if (typeof status != 'number') {
    headers = data, data = status, status = 200;
  }

  this.status = status;
  this.data = data;
  this.headers = headers;
};
