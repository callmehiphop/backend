// keep original xhr constructor
var HttpRequest = window.XMLHttpRequest;



/**
 * Returns new XHR Object, whatever the hell it may be!
 * @return {object} XHR
 */
var xhr = function() {
  if (HttpRequest) {
    return new HttpRequest();
  } else if (window.ActiveXObject) {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
};



/**
 * Creates a fake XHR request
 */
window.XMLHttpRequest = function() {

  // request data goes here
  var data = { headers: {} };
  var responseHeaders;
  var realXhr;

  
  // fake event listeners
  this.onabort = null;
  this.onerror = null;
  this.onload = null;
  this.onloadend = null;
  this.onloadstart = null
  this.onprogress = null;
  this.onreadystatechange = null;

  // fake properties
  this.readyState = 0;
  this.response = '';
  this.responseText = '';
  this.responseType = '';
  this.responseXML = null;
  this.status = 0;
  this.statusText = '';
  this.withCredentials = false;


  /**
   * Stores all request information within data object
   */
  this.open = function(method, url, async, username, password) {
    data.method = method;
    data.url = url;
    data.async = async;
    data.username = username;
    data.password = password;
  };


  /**
   * Checks to see if we have a Mock request in place for
   * supplied information, if so, server up mocked response
   * If not, attempt to make an actual request
   */
  this.send = function(params) {
    var dParams;
    var mock;

    // jquery will set to null
    params = params || undefined;
    dParams = isString(params) ? deserialize(params) : params;

    each(mocks, function(mockedRequest) {
      if (mockedRequest.match(data.method, data.url, dParams, data.headers)) {
        mock = mockedRequest;
        return false;
      }
    });

    if (mock) {
      var response = mock.response();
      var responseText = response[1];

      if (isObject(responseText)) {
        responseText = JSON.stringify(responseText);
      }

      // set properties to simulate success
      extend(this, {
        readyState: 4,
        status: response[0],
        response: responseText,
        responseText: responseText
      });

      responseHeaders = response[2] || {};

      if (isFunction(this.onreadystatechange)) {
        this.onreadystatechange();
      }
    } else {
      var fakeXhr = this;

      realXhr = xhr();
      realXhr.open(data.method, data.url, data.async, data.username, data.password);

      realXhr.onreadystatechange = function() {
        extend(fakeXhr, props(this, true));

        if (isFunction(fakeXhr.onreadystatechange)) {
          fakeXhr.onreadystatechange();
        }
      };

      each(keys(data.headers), function(key) {
        this.setRequestHeader(key, data.headers[key]);
      }, realXhr);

      realXhr.send(params);
    }
  };


  /**
   * Stores request headers in data object, in the event that
   * an actual HTTP request needs to be made, we'll call setRequestHeader
   * on the actual XHR object
   */
  this.setRequestHeader = function(key, value) {
    data.headers[key] = value;
  };


  /**
   * Attempts to retrieve response header
   */
  this.getResponseHeader = function(key) {
    return realXhr ? realXhr.getResponseHeader(key) : responseHeaders[key];
  };


  /**
   * Attempts to retrieve response headers
   */
  this.getAllResponseHeaders = function() {
    return realXhr ? realXhr.getAllResponseHeaders() : serialize(responseHeaders);
  };


  /**
   * Checks to see if we made a real XHR request and if so, abort it
   */
  this.abort = function() {
    realXhr && realXhr.abort();
  };


};