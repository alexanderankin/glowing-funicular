var crypto = require('crypto');
var CodeStore = require('./CodeStore');
var codeStore = new CodeStore();
var ClientStore = require('./ClientStore');
var clientStore = new ClientStore();

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
function isValidUser(username, password, scopes, callback) {
  process.nextTick(callback.bind(null, null, true));
}

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
  isValidUser, generateRandom, isValidClient,
  checkToken, basicAuthMW,
  CodeStore, codeStore,
  ClientStore, clientStore,
  accessTokenErrors: require('./accessTokenErrors'),
  webToken: require('./webToken'),
};

// generateRandom(function (err, result) {
//   console.log(result);
// });
