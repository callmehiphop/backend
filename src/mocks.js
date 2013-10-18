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
        if (!this.headers || equals(this.headers, headers)) {
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