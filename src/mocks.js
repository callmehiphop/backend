//----------------------------------------------------
//  Mock Stuff!
//----------------------------------------------------

var mocks = [];


/**
 * Creates a new Mock object, used to return the desired response
 * for supplied request information
 * @param {string} method
 * @param {string|regexp} url
 * @param {data} object (optional)
 * @param {headers} object (optional)
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
        if (equals(this.headers, headers)) {
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
  return function() {
    return isNumber(status) ? arguments : [200, status, data];
  };
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
 * backend.get('/my/thing', { u: 'jello', p: 'biafra' }, { header: 'aww-yeah' })
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