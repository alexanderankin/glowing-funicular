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

CodeStore.prototype.store = function(code, user, scopes) {
  this.list.push({ code, user, scopes });
};

CodeStore.prototype.get = function(code) {
  var el = null;
  for (var idx = 0; idx < this.list.length; idx++) {
    el = this.list[idx];
    if (el.code !== code) { continue; }

    this.list.splice(idx, 1);
    break;
  }

  return el;
};

var codeStore = new CodeStore();

module.exports = {
  isValidUser, generateRandom, CodeStore, codeStore
};

// generateRandom(function (err, result) {
//   console.log(result);
// });
