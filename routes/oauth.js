var express = require('express');
var router = express.Router();

var querystring = require('querystring');

var lib = require('../lib');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('oauth', { title: 'Express | oauth endpoint' });
});

var loginpageGet;
router.get('/loginpage', loginpageGet = function (req, res, next) {
  res.render('oauth', { title: 'Express | login get', page: `
    <form action="loginpage" method="post">
      <input type="text" name="username" />
      <input type="text" name="password" />
      <input type="submit" />
    </form>
  ` });
});

var loginpagePost;
router.post('/loginpage', loginpagePost = function (req, res, next) {
  lib.isValidUser(req.body.username, req.body.password, req.session.scope, function (err, value) {
    if (err) { throw err; }
    if (!value) { return res.send('goaway'); }

    lib.generateRandom(function (err, value) {
      var code = value;
      lib.codeStore.store(code, req.body.username, req.session.scopes);

      res.render('oauth', { title: 'Express | login post', page: `
        <pre>${JSON.stringify(req.session)}</pre>
        <p>redirecting to ${req.session.redirect_uri}?${querystring.stringify({code})}</p>
      ` });
    });
  });
});

/**
 * TODO: if (req.query.response_type === "code") {}
 * 
 */
router.get('/authorize', function (req, res, next) {
  req.session.redirect_uri = req.query.redirect_uri;
  req.session.client_id = req.query.client_id;
  req.session.scopes = req.query.scopes;

  res.render('oauth', { title: 'Express | authorize get', page: `
    <pre>${JSON.stringify(req.body)}</pre>
    <pre>${JSON.stringify(req.query)}</pre>
    <form action="/oauth/loginpage" method="post">
      <input type="text" name="username" />
      <input type="text" name="password" />
      <input type="submit" />
    </form>
  `});
});

/**
 * todo: basic authentication.
 */
router.post('/token', function (req, res, next) {
  lib.isValidClient(req.body.client_id, req.body.client_secret, function (e, r) {
    if (!r) return res.json({err: true});

    var code = req.body.code;
    var token = lib.codeStore.get(code);
    res.json({ token });
  });
});

router.post('/check_token', function (req, res, next) {
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

module.exports = router;
