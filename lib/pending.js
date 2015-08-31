'use strict';

var _ = require('./dash');
var pendingRequests = [];
var pending = module.exports = {};

pending.add = function (timeoutId, request) {
  pendingRequests.push({ timeoutId: timeoutId, request: request });
};

pending.remove = function (request) {
  for (var i = 0; i < pendingRequests.length; i++) {
    if (pendingRequests[i].request === request) {
      clearTimeout(pendingRequests[i].timeoutId);
      pendingRequests.splice(i, 1);
      return;
    }
  }
};

pending.clear = function () {
  _.each(pendingRequests, function(pending) {
    clearTimeout(pending.timeoutId);
  });
  pending.length = 0;
};

/**
 * Execute any pending requests syncrounously
 */
pending.flush = function (method, url, params, headers) {
  while (pendingRequests.length) {
    var pending = pendingRequests.shift();
    clearTimeout(pending.timeoutId);

    if (pending.request.onreadystatechange) {
      pending.request.onreadystatechange();
    } else if (pending.request.onload) {
      pending.request.onload();
    }
  }
};

/**
 * Return any outstanding pending requests
 * @return {array[Request]}
 */
pending.outstanding = function() {
  return _.map(pendingRequests, function(pending) {
    return pending.request;
  });
};
