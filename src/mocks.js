var mocks = {};

var on = function(method, url, data, headers) {

};

String.prototype.on = function(method, data, headers) {
  return on(method, this, data, headers, callback);
};