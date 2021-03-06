var express = require('express');
var router = express.Router();

var querystring = require('querystring');

var config = require('../config');
var lib = require('../lib');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('oauth', { title: 'Express | oauth endpoint' });
});

router.post(config.paths.login, function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var scopes = req.session.scopes;
  var state  = req.session.state;

  lib.isValidUser(username, password, scopes, function (err, value) {
    if (err) { throw err; }
    if (!value) { return res.send('goaway'); }

    lib.generateRandom(function (err, value) {
      var code = value;
      lib.codeStore.store(code, username, scopes, state);

      var redirectingUrl = `${req.session.redirect_uri}?${querystring.stringify({code, state})}`;

      if (config.doNotRedirect) {
        res.render('oauth', { title: 'Express | login post', page: `
          <pre>${JSON.stringify(req.session)}</pre>
          <p>redirecting to 
            <a id="redirecting" href="${redirectingUrl}">${redirectingUrl}</a>
          </p>
        ` });
      } else {
        res.redirect(redirectingUrl);
      }
    });
  });
});

/**
 * TODO: if (req.query.response_type === "code") {}
 * 
 */
router.get(config.paths.authorization, function (req, res, next) {
  req.session.redirect_uri = req.query.redirect_uri;
  req.session.client_id    = req.query.client_id;
  req.session.scopes       = req.query.scopes;
  req.session.state        = req.query.state;

  res.render('oauth', { title: 'Express | authorize get', page: `
    <pre>${JSON.stringify(req.body)}</pre>
    <pre>${JSON.stringify(req.query)}</pre>
    <form action="${req.baseUrl}${config.paths.login}" method="post">
      <input type="text" name="username" id="username" />
      <input type="text" name="password" id="password" />
      <input type="submit" />
    </form>
  `});
});

/**
 * todo: basic authentication.
 * 
 * https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
 */
router.post(config.paths.token, lib.basicAuthMW, function (req, res, next) {
  var client_id = req.basicAuth.username
    || req.headers.client_id
    || req.body.client_id;
  var client_secret = req.basicAuth.password
    || req.headers.client_secret
    || req.body.client_secret;

  lib.isValidClient(client_id, client_secret, function (e, r) {
    if (e) return res.status(400).json(lib.accessTokenErrors.invalid_request);
    if (!r) return res.status(400).json(lib.accessTokenErrors.invalid_client);

    var code = req.body.code;
    var token = lib.codeStore.get(code);

    if (!token) {
      return res.status(400).json(lib.accessTokenErrors.invalid_grant);
    }

    var token_type = "bearer";
    var expires_in = 3600;
    var scope = token.scopes ? token.scopes.join(" ") : undefined;
    var state = token.state;

    lib.generateRandom((err, rand) => {
      var user = token.user;
      var access_token  = lib.webToken.sign({ client_id, user, scope });
      var refresh_token = rand;

      res.json({
        access_token, refresh_token,
        token_type, expires_in, scope, state
      });
    });
  });
}, function (err, req, res, next) {
  res.status(400).json(lib.accessTokenErrors.invalid_request);
});

router.post(config.paths.tokenVerification, function (req, res, next) {
  var token = req.body.token;
  lib.checkToken(function (err, verdict) {
    var success;
    if (verdict) {
      success = true;
    } else {
      success = false;
    }

    res.json({ success });
  });
});

router.post(config.paths.tokenRefresh, function (req, res, next) {
});

module.exports = router;
