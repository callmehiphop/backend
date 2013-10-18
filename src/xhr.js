//----------------------------------------------------
//  XHR Hijack!
//----------------------------------------------------

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
 * Creates a fake XHR
 */
window.XMLHttpRequest = function() {

  // request data goes here
  var data = { headers: {} };
  var responseHeaders;
  var realXhr;

  
  extend(this, {

    // fake event listeners
    onabort: null,
    onerror: null,
    onload: null,
    onloadend: null,
    onloadstart: null,
    onprogress: null,
    onreadystatechange: null,

    // fake properties
    readyState: 0,
    response: '',
    responseText: '',
    responseType: '',
    responseXML: null,
    status: 0,
    statusText: '',
    withCredentials: false,
  


    /**
     * Stores all request information within data object
     */
    open: function(method, url, async, username, password) {
      data.method = method;
      data.url = url;
      data.async = async;
      data.username = username;
      data.password = password;
    },


    /**
     * Checks to see if we have a Mock request in place for
     * supplied information, if so, serve up mocked response
     * If not, attempt to make an actual request
     */
    send: function(params) {
      var dParams;
      var mock;

      // jquery will set to null
      params = params || undefined;
      dParams = isString(params) ? deserialize(params) : params;

      // try and find a matching mock object
      each(mocks, function(mockedRequest) {
        if (mockedRequest.match(data.method, data.url, dParams, data.headers)) {
          mock = mockedRequest;
          return false;
        }
      });

      // if we found one, lets serve it up!
      if (mock) {
        var responseText = mock.response.data;

        if (isObject(responseText)) {
          responseText = JSON.stringify(responseText);
        }

        // set properties to simulate success
        extend(this, {
          readyState: 4,
          status: mock.response.status,
          response: responseText,
          responseText: responseText
        });

        responseHeaders = mock.response.headers || {};

        if (isFunction(this.onreadystatechange)) {
          this.onreadystatechange();
        }
      // if not, let's make a real request
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
    },


    /**
     * Stores request headers in data object, in the event that
     * an actual HTTP request needs to be made, we'll call setRequestHeader
     * on the actual XHR object
     */
    setRequestHeader: function(key, value) {
      data.headers[key] = value;
    },


    /**
     * Attempts to retrieve response header
     */
    getResponseHeader: function(key) {
      return realXhr ? realXhr.getResponseHeader(key) : responseHeaders[key];
    },


    /**
     * Attempts to retrieve response headers
     */
    getAllResponseHeaders: function() {
      return realXhr ? realXhr.getAllResponseHeaders() : serialize(responseHeaders);
    },


    /**
     * Checks to see if we made a real XHR request and if so, abort it
     */
    abort: function() {
      if (realXhr) {
        realXhr.abort();
      }
    }

  });


};
