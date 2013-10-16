// keep original xhr constructor
var HTTPRequest = XMLHttpRequest;



/**
 * Returns new XHR Object, whatever the hell it may be!
 * @return {object} XHR
 */
var xhr = function() {
  if (HTTPRequest) {
    return new HTTPRequest();
  } else if (window.ActiveXObject) {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
};



/**
 * Creates a new fake XHR object
 */
XMLHttpRequest = function() {
  this.readyState = this.status = 0;
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
      extend(fakeXhr, props(this, true));

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
