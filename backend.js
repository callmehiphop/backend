/*!
 * backend.js - v0.0.2
 * github.com/callmehiphop/backend.js
 */
(function(root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.backend = factory();
  }
}(this, function(undefined) {

'use strict';




/**
 * Shorthand slice, should be used with .call
 * slice.call(['red', 'blue'], 1);
 */
var slice = Array.prototype.slice;


/**
 * Iterates over an array of things
 * returning false breaks the loop
 * @param {array} things
 * @param {function} callback
 * @param {object} context - optional
 */
var each = function(things, callback, context) {
  for (var i = 0; i < things.length; i++) {
    if (callback.call(context || this, things[i], i, things) === false) {
      break;
    }
  }
};


/**
 * Quick shallow copy of one object to another
 * @param {object} target
 * @param {object} object(s) to extend
 * @return {object} target
 */
var extend = function(target) {
  each(slice.call(arguments, 1), function(obj) {
    for (var key in obj) {
      target[key] = obj[key];
    }
  });

  return target;
};


/**
 * Because I hate typing out obj.hasOwnProperty!
 * I'm lazy for reals
 * @param {object} obj
 * @param {string} key
 * @return {boolean}
 */
var has = function(obj, key) {
  return obj.hasOwnProperty(key);
};


/**
 * Picks out specified properties of an object
 * @param {object} obj
 * @param {array} keys
 * @return {object} results
 */
var pick = function(obj, keys) {
  var results = {};

  each(keys, function(key) {
    if (has(obj, key)) {
      results[key] = obj[key];
    }
  });

  return results;
};


/**
 * Grabs all properties of an object, unless falseys is
 * set to true, in which case it only grabs truthy values
 * @param {object} obj
 * @param {boolean} falseys
 * @return {object} results
 */
var props = function(obj, falseys) {
  var results = {};

  for (var i in obj) {
    if (!isFunction(obj[i]) && (!falseys || obj[i])) {
      results[i] = obj[i];
    }
  }

  return results;
};


/**
 * Because I really hate having to pass in
 * the object I'm calling apply from
 * @param {object} obj
 * @param {string} method
 * @param {array} args
 * @param {object} context - optional
 * @return {mixed}
 */
var apply = function(obj, method, args, context) {
  return obj[method].apply(context || obj, args);
};


/**
 * Retrieves ALL keys from a supplied object
 * @param {object} obj
 * @return {array} keys
 */
var keys = function(obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};


/**
 * Merges two arrays into one without disrupting
 * the originals.
 * @param {array} arr1
 * @param {array} arr2
 * @return {array} result
 */
var merge = function(arr1, arr2) {
  var result = arr1.slice(0);

  each(arr2, function(thing) {
    if (!~result.indexOf(thing)) {
      result.push(thing);
    }
  });

  return result.sort();
};


/**
 * Checks to see if two objects are the same, this is
 * probably super lazy, but meh
 * @param {object} a
 * @param {object} b
 * @return {boolean}
 */
var equals = function(a, b) {
  if (!isObject(a)) {
    return a === b;
  }

  var props = merge(keys(a), keys(b));
  var isEqual = true;

  each(props, function(prop) {
    if (a[prop] !== b[prop]) {
      if ((!isObject(a[prop]) && !isObject(b[prop])) || !equals(a[prop], b[prop])) {
        isEqual = false;
        return false;
      }
    }
  });

  return isEqual;
};


/**
 * Kinda like equal, except it checks to see that b
 * implements all of a, but a can have more than b
 * @param {object} a
 * @param {object} b
 * @return {boolean}
 */
var contains = function(a, b) {
  for (var i in b) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};


/**
 * Generates a simple type check function using the
 * "typeof" operator
 * @param {string} type
 * @return {function} type checker
 */
var isType = function(type) {
  return function(thing) {
    return typeof thing === type;
  };
};


/**
 * Checks to see if supplied thing is of type function
 * @param {mixed} thing - hopefully a function
 * @return {boolean}
 */
var isFunction = isType('function');


/**
 * Checks to see if supplied thing is of type object
 * @param {mixed} thing - hopefully an object
 * @return {boolean}
 */
var isObject = isType('object');


/**
 * Checks to see if the supplied thing is of type number
 * @param {mixed} thing - hopefully a number
 * @return {boolean}
 */
var isNumber = isType('number');


/**
 * Checks to see if the supplied thing is of type string
 * @param {mixed} thing - hopefully a string
 * @return {boolean}
 */
var isString = isType('string');


/**
 * Turns a shallow object into serialized data
 * @param {object} obj
 * @return {string} results
 */
var serialize = function(obj) {
  var results = '';

  for (var i in obj) {
    results += i + '=' + obj[i] + '&';
  }

  return results.slice(0, -1);
};


/**
 * Turns serialized data into a shallow object
 * @param {string} str
 * @return {object} results
 */
var deserialize = function(str) {
  var results = {};

  str.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    function($0, $1, $2, $3) { results[$1] = $3; }
  );

  return results;
};




//----------------------------------------------------
//  Mock Stuff!
//----------------------------------------------------

var mocks = [];


/**
 * Creates a new Mock object, used to return the desired response
 * for supplied request information
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data (optional)
 * @param {object} headers (optional)
 */
var Mock = function(method, url, data, headers) {
  this.method = method.toUpperCase();
  this.url = url instanceof RegExp ? url : routeToRegExp(url);
  this.data = data;
  this.headers = headers;
};


extend(Mock.prototype, {

  /**
   * Checks to see if the current Mock matches the supplied
   * request information
   * @param {string} method
   * @param {string} url
   * @param {object} data
   * @param {object} headers
   * @return {boolean}
   */
  match: function(method, url, data, headers) {
    if (this.url.test(url)) {
      if (this.method === method.toUpperCase()) {
        // can't do equals(), as jQuery will add extra headers
        if (!this.headers || contains(headers, this.headers)) {
          if (equals(this.data, data)) {
            return true;
          }
        }
      }
    }

    return false;
  }

});





//----------------------------------------------------
//  Route Stuff! (All stolen from Backbone!)
//----------------------------------------------------

var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;


/**
 * Converts a dynamic URL string into a Regular Expression
 * e.g. '/posts/:postId/author' becomes /^/posts/([^/]+)/author$/
 * @param {string} route
 * @return {regexp} route
 */
var routeToRegExp = function(route) {
  route = route.replace(escapeRegExp, '\\$&').
    replace(optionalParam, '(?:$1)?').
    replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
    }).
    replace(splatParam, '(.*?)');

  return new RegExp('^' + route + '$');
};




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




//----------------------------------------------------
//  Exposed API
//----------------------------------------------------

var backend = {};


/**
 * Creates a new Mock object
 * @param {string} method
 * @param {string|regexp} url
 * @param {object} data
 * @param {object} headers
 * @return {object} respond
 */
backend.when = function(method, url, data, headers) {
  var mock = new Mock(method, url, data, headers);
  mocks.push(mock);

  return {
    
    /**
     * Assigns a response to the current mock
     * @param {number} status (optional)
     * @param {object} data
     * @param {object} headers
     */
    respond: function(status, data, headers) {
      mock.response = createResponse(status, data, headers);
    }

  };
};


/**
 * Checks to see if a status code was provided, otherwise defaults
 * it to 200, then creates a function to return all items in an array
 * @param {number} status (optional)
 * @param {object} data
 * @param {object} headers
 */
var createResponse = function(status, data, headers) {
  return isNumber(status)
    ? { status: status, data: data, headers: headers }
    : { status: 200, data: status, headers: data };
};





//----------------------------------------------------
//  Convenience Methods!
//----------------------------------------------------

/**
 * Creates convenience methods for GET, DELETE and JSONP
 * backend.get('/my/thing', { header: 'aww-yeah' })
 * @param {string} url
 * @param {object} headers
 * @return {object} respond
 */
each(['get', 'delete', 'jsonp'], function(method) {
  backend[method] = function(url, headers) {
    return backend.when(method, url, undefined, headers);
  };
});


/**
 * Creates convenience methods for PUT, POST and PATCH
 * backend.post('/my/thing', { u: 'jello', p: 'biafra' }, { header: 'aww-yeah' })
 * @param {string} url
 * @param {object} data
 * @param {object} headers
 * @return {object} respond
 */
each(['put', 'post', 'patch'], function(method) {
  backend[method] = function(url, data, headers) {
    return backend.when(method, url, data, headers);
  };
});


/**
 * Allows for fancy-pants way of declaring mocks
 * '/my/awesome/thing'.on('get', { ying: 'yang' }, { header: 'aww-yeah' });
 * @param {string} method
 * @param {object} data
 * @param {object} headers
 * @return {object} respond
 */
String.prototype.on = function(method, data, headers) {
  return backend.when(method, this, data, headers);
};





return backend;

}));