var jwt = require('jsonwebtoken');

var secret = process.env['jwt_secret'] || 'keyboard ninja';

function sign(argument) {
  return jwt.sign(argument, secret);
}

function verify(argument, cb) {
  jwt.verify(argument, secret, function (err, decoded) {
    if (err) return cb(err);
    return cb(null, decoded);
  });
}

module.exports = {
  sign, verify
};
