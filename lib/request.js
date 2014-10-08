'use strict';

var _ = require('./lodash.custom');
var mocks = require('./mocks');
var HttpRequest = global.XMLHttpRequest;

/**
 * Attempts to create a new XHR object
 * @return {object}
 */
function xhr () {
  if (HttpRequest) {
    return new HttpRequest();
  }

  if (global.ActiveXObject) {
    return new global.ActiveXObject('Microsoft.XMLHTTP');
  }

  throw new TypeError('Unknown XHR Constructor');
}

/**
 * Formats a map of headers to what XHR should return
 * @param {object} headers
 * @return {string}
 */
function stringifyHeaders (headers) {
  return _.map(headers, function (header, name) {
    return name + ': ' + header;
  }).join('\n');
}

/**
 * Fake XHR Constructor
 */
var Request = module.exports = function () {
  var data = { headers: {} };
  var request = xhr();
  var mock, timer;

  /**
   * Captures request data
   * @param {string} method
   * @param {string} url
   * @param {boolean} [async]
   */
  this.open = function (method, url, async) {
    data.method = method;
    data.url = url;
    data.async = _.isUndefined(async) ? true : async;
  };

  /**
   * Captures params and then checks to see if we have a stubbed request
   * If we do, then it simulates a response, otherwise it attempts to
   * make the actual request
   * @param {*} params
   */
  this.send = function (params) {
    var resolve, response;

    data.params = params || undefined;

    if (!(mock = mocks.match(data))) {
      _.extend(request, _.pick(this, function (value, key) {
        return _.has(request, key);
      }));

      request.open(data.method, data.url, data.async);

      _.each(data.headers, function (header, name) {
        request.setRequestHeader(name, header);
      });

      return request.send(params);
    }

    resolve = _.bind((this.onreadystatechange || this.onload || _.noop), this);
    response = mock.response.data;

    if (_.isObject(response)) {
      response = JSON.stringify(response);
    }

    _.extend(this, {
      readyState: 4,
      status: mock.response.status,
      response: response,
      responseText: response
    });

    if (!data.async) {
      return resolve();
    }

    timer = setTimeout(resolve, 100);
  };

  /**
   * Stores a request header
   */
  this.setRequestHeader = function (key, value) {
    data.headers[key] = value;
  };

  /**
   * Returns response headers
   * @return {string}
   */
  this.getAllResponseHeaders = function () {
    if (!mock) return request.getAllResponseHeaders();

    return stringifyHeaders(mock.response.headers);
  };

  /**
   * Returns single response header
   * @param {string} key
   * @return {string}
   */
  this.getResponseHeader = function (key) {
    if (!mock) return request.getResponseHeader();

    return mock.headers[key];
  };

  /**
   * Just passing through!
   */
  this.overrideMimeType = function () {
    request.overrideMimeType();
  };

  /**
   * Aborts the request!
   */
  this.abort = function () {
    if (!mock) request.abort();

    clearTimeout(timer);
    (this.onabort || _.noop)();
  };

};
