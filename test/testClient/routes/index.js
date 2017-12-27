var express = require('express');
var router = express.Router();

var querystring = require('querystring');

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  var info = {
    client_id     : 'client_id',
    redirect_uri  : 'http://localhost:4001/redirect_uri',
    scopes        : [ 'mail', 'news' ],
    response_type : 'code',
    state         : 'keyboard yes',
  };

  var queryString = querystring.stringify(info);
  res.render('page', { title: 'Express', page: `
    <a id="link" href="http://localhost:4000/oauth/authorize/?${queryString}">loginlink</a>
  ` });
});

router.get('/redirect_uri', function (req, res, next) {
  var grant_type   = "authorization_code";
  var code         = req.query.code;
  var state        = req.query.state;
  var redirect_uri = 'http://localhost:4001/redirect_uri';

  var client_id = 'client_id';
  var client_secret = 'client_secret';

  request.post('http://localhost:4000/oauth/token', {
    json: true,
    body: { grant_type, code, redirect_uri, client_id, client_secret }
  }, function (err, resp, body) {
    if (err) { return res.render('page', { page: `<pre>${JSON.stringify({err})}</pre>`}) }
    var accessToken = body.access_token;

    res.render('page', { title: 'Express | redirect_uri', page: `
      <p>body</p>
      <p>the Code is : ${code}</p>
      <p>the State is : ${state}</p>
      <p>the Access Token is : <span id="access_token">${JSON.stringify(accessToken)}</span></p>
      <pre>${JSON.stringify(req.body)}</pre>
      <p>query</p>
      <pre>${JSON.stringify(req.query)}</pre>
    ` });
  })
});

module.exports = router;
