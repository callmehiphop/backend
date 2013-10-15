var HTTPRequest = XMLHttpRequest;
var mocks = {};



/**
 *
 */
var xhr = function() {
  if (HTTPRequest) {
    return new HTTPRequest();
  } else if (window.ActiveXObject) {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
};



/**
 *
 */
XMLHttpRequest = function() {

};


extend(XMLHttpRequest.prototype, {


  /**
   *
   */
  open: function() {
    this._xhr = xhr();
    apply(this._xhr, 'open', arguments);
  },


  /**
   *
   */
  send: function() {
    var fakeXhr = this;

    this._xhr.onreadystatechange = function() {
      extend(fakeXhr, this);

      if (isFunction(fakeXhr.onreadystatechange)) {
        fakeXhr.onreadystatechange();
      }
    };

    apply(this._xhr, 'send', arguments);
  },


  /**
   *
   */
  getAllResponseHeaders: function() {
    return this._xhr.getAllResponseHeaders();
  }


});
