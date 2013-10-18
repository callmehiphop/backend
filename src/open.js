(function(root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.backend = factory();
  }
}(this, function(undefined) {

'use strict';
