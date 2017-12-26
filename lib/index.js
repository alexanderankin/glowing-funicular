var crypto = require('crypto');

function generateRandom(callback) {
  crypto.randomBytes(256, function(err, buffer) {
    var result = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');

    callback(null, result);
  });
}

/**
 * Users are associated with a password (1-1)
 * Users to scopes are a many to many relationship.
 * 
 * To return true, select from users where password join.
 */
function isValidUser(username, password, scope, callback) {
  process.nextTick(callback.bind(null, null, true));
}

function CodeStore() {
  this.list = [];
}

CodeStore.prototype.store = function(code, user, scopes, state) {
  this.list.push({ code, user, scopes, state });
};

CodeStore.prototype.get = function(code) {
  var el = null;
  var result = null;
  for (var idx = 0; idx < this.list.length; idx++) {
    el = this.list[idx];
    // if (el.code !== code) { console.log("skipping", el, el.code, code); continue; }
    if (el.code !== code) { continue; }

    result = el;
    this.list.splice(idx, 1);
    break;
  }

  return result;
};

var codeStore = new CodeStore();

/**
 * for token endpoint
 */
function isValidClient(clientId, clientSecret, callback) {
  if (clientId && clientSecret) {
    process.nextTick(callback.bind(null, null, true));
  } else {
    process.nextTick(callback.bind(null, null, true));
  }
}

function checkToken(callback) {
  process.nextTick(callback.bind(null, null, true));
}

/**
 * Create a req.basicAuth object if the header is present
 */
function basicAuthMW(req, res, next) {
  req.basicAuth = {};

  if (req.headers.authorization) {
    if (req.headers.authorization.split(" ")[0].toLowerCase() === "basic") {
      var [authType, authCred] = req.headers.authorization.split(" ");
      authCred = Buffer.from(authCred, 'base64').toString();
      var [username, password] = authCred.split(":");
      req.basicAuth = { username, password };
    }
  }

  next();
}



module.exports = {
  isValidUser, generateRandom, CodeStore, codeStore, isValidClient,
  checkToken, basicAuthMW,
  accessTokenErrors: require('./accessTokenErrors'),
  webToken: require('./webToken'),
};

// generateRandom(function (err, result) {
//   console.log(result);
// });
