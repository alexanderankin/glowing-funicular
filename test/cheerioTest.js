var cheerio = require('cheerio');
var expect = require('chai').expect;
var request = require('request');
var path = require('path');
var url = require('url');
var http = require('http');
var app = require('../app');

describe.only('try do a thing', function () {
  it('is a thing', function (done) {
    // get client
    var jarRequest = request.defaults({ jar: true });

    // get server
    var server = http.createServer(app);
    server.listen(4000);
    server.once('listening', () => {
      // visit site
      jarRequest.get('http://localhost:4001', function (err, resp, body) {
        var $ = cheerio.load(body);
        var loginLink = $('#link').attr('href');

        // goto login/authorize
        jarRequest.get(loginLink, function (err, resp, body) {
          var $ = cheerio.load(body);
          $('#username').val('username1');
          $('#password').val('password1');
          var formData = $('form').serialize();
          var formAction = $('form').attr('action');
          formAction = url.resolve('http://localhost:4000', formAction);

          // authorize login (post)
          jarRequest.post(formAction, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          }, function (err, resp, body) {
            var $ = cheerio.load(body);

            // follow redirect, deliver code
            var redirectCallbackURL = $('#redirecting').attr('href');
            jarRequest.get(redirectCallbackURL, function (err, resp, body) {
              var $ = cheerio.load(body);
  
              var accessToken = $('#access_token').text();
              // print token.
              console.log(accessToken);
              done();
            });
          });
        });
      });
    });  // once listening
  });
});
