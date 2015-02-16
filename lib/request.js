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
  var fakeRequest = this;
  var request = xhr();
  var method, url, async;
  var headers = {};
  var mock, timer;

  /**
   * Checks to see if an item in the xhr object is not in the prototype chain
   * @param {*} value
   * @param {string} key
   * @return {boolean}
   */
  function requestHasProp (value, key) {
    return _.has(request, key);
  }

  /**
   * Since we didn't find a mock, lets send a real request out and update
   * the fake request object upon completion
   * @param {*} params
   */
  function sendRealRequest (params) {
    request.addEventListener('readystatechange', function () {
      if (request.readyState !== 4) return;
      _.extend(fakeRequest, _.pick(request, requestHasProp));
    });

    _.extend(request, _.pick(fakeRequest, requestHasProp));

    request.open(method, url, async);

    _.each(headers, function (header, name) {
      request.setRequestHeader(name, header);
    });

    request.send(params);
  }

  /**
   * We found a mocked response! Let's serve that sucker up
   */
  function sendFakeRequest () {
    var resolve = fakeRequest.onreadystatechange || fakeRequest.onload || _.noop;
    var response = mock.response.data;

    if (_.isObject(response)) {
      response = JSON.stringify(response);
    }

    _.extend(fakeRequest, {
      readyState: 4,
      status: mock.response.status,
      response: response,
      responseText: response
    });

    resolve = _.bind(resolve, fakeRequest);

    if (!async) {
      return resolve();
    }

    timer = setTimeout(resolve, 100);
  }

  /**
   * Captures request data
   * @param {string} method
   * @param {string} url
   * @param {boolean} [async]
   */
  this.open = function (_method, _url, _async) {
    method = _method;
    url = _url;
    async = _.isUndefined(_async) ? true : _async;
  };

  /**
   * Captures params and then checks to see if we have a stubbed request
   * If we do, then it simulates a response, otherwise it attempts to
   * make the actual request
   * @param {*} params
   */
  this.send = function (params) {
    // jquery will set to null
    params = params || undefined;

    if (!(mock = mocks.match(method, url, params, headers))) {
      return sendRealRequest(params);
    }

    return sendFakeRequest();
  };

  /**
   * Stores a request header
   */
  this.setRequestHeader = function (key, value) {
    headers[key] = value;
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

    return mock.response.headers[key];
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
