var express = require('express');
var router = express.Router();

var querystring = require('querystring');

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
  var code = "code";
  // res.render('oauth', { title: 'Express | login post', page: `
  //   <pre>${JSON.stringify(req.body)}</pre>
  //   <pre>${JSON.stringify(req.query)}</pre>
  // ` });
  res.render('oauth', { title: 'Express | login post', page: `
    <p>redirecting to ${req.session.redirect_uri}?${querystring.stringify({code})}</p>
  ` });

});

router.get('/authorize', function (req, res, next) {
  req.session.redirect_uri = req.query.redirect_uri;

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

module.exports = router;
