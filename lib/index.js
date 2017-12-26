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

function isValidUser(username, password) {
  return true;
}

module.exports = {
  isValidUser
};

generateRandom(function (err, result) {
  console.log(result);
});
