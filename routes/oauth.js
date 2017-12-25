var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('oauth', { title: 'Express | oauth endpoint' });
});

router.get('/loginpage', function (req, res, next) {
  res.render('oauth', { title: 'Express | login get', page: `
    <form action="loginpage" method="post">
      <input type="text" name="username" />
      <input type="text" name="password" />
      <input type="submit" />
    </form>
  ` });
});

router.post('/loginpage', function (req, res, next) {
  res.render('oauth', { title: 'Express | login post', page: `
    <pre>${JSON.stringify(req.body)}</pre>
  ` });
})

module.exports = router;
