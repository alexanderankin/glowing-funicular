var util = require('util');

var validUrl = require('valid-url');

function ClientStore() {
  this.list = [];
}

ClientStore.prototype.register = function(clientId, clientSecret, urls) {
  var e = { clientId, clientSecret, urls };

  // catch duplicates
  this.list.forEach(function (client) {
    if (client.clientId === clientId)
      throw new ClientStoreDuplicateError(clientId, e);
  });

  // catch malformed urls
  urls.forEach(function (url) {
    if (!validUrl.isWebUri(url))
      throw new ClientStoreUrlError(url, e);
  });

  this.list.push(e);
};


ClientStore.prototype.verifyClient = function(clientId) {
  var length = this.list.length;
  for (var idx = 0; idx < length; idx++) {
    if (this.list[idx].clientId === clientId)
      return true;
  }

  return false;
};

ClientStore.prototype.verifyClientSecret = function(clientId, clientSecret) {
  var length = this.list.length;
  for (var idx = 0; idx < length; idx++) {
    var e = this.list[idx];
    if (e.clientId === clientId && e.clientSecret === clientSecret)
      return true;
  }

  return false;
};

ClientStore.prototype.verifyUrl = function(clientId, url) {
  for (var idx = 0; idx < this.list.length; idx++) {
    var e = this.list[idx];
    if (e.clientId === clientId && e.urls.indexOf(url) > -1)
      return true;
  }

  return false;
};

function ClientStoreUrlError(url, entry) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Client ID "${entry.clientId}" tried to register with bad ` +
    `redirection url "${url}".`;
  this.url = url;
  this.entry = entry;
}
util.inherits(ClientStoreUrlError, Error);
ClientStore.ClientStoreUrlError = ClientStoreUrlError;

function ClientStoreDuplicateError(clientId, entry) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Tried to register duplicate Client ID "${clientId}"`;
  this.entry = entry;
}
util.inherits(ClientStoreDuplicateError, Error);
ClientStore.ClientStoreDuplicateError = ClientStoreDuplicateError;

module.exports = ClientStore;
