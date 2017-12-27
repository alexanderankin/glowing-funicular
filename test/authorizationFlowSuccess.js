var path = require('path');
var url = require('url');
var http = require('http');

var expect = require('chai').expect;
var validUrl = require('valid-url');
var cheerio = require('cheerio');
var request = require('request');
var app = require('../app');
var clientApp = require('./testClient/app');

var lib = require('../lib');

describe.only('Authorization Code Grant Flow', function () {
  it('Successfully issues a valid jwt token', function (done) {
    // get resource owner
    var jarRequest = request.defaults({ jar: true });

    // get server
    var server = http.createServer(app);
    server.listen(4000);
    server.once('error', (error) => { expect(error).to.be.null; done(); });
    server.once('listening', () => {
      var clientServer = http.createServer(clientApp);
      clientServer.listen(4001);
      clientServer.once('error', (error) => { expect(error).to.be.null; done(); });
      clientServer.once('listening', () => {

        // visit client
        jarRequest.get('http://localhost:4001', function (err, resp, body) {
          expect(err).to.be.null;
          var $ = cheerio.load(body);
          var loginLink = $('#link').attr('href');

          // goto login/authorize
          jarRequest.get(loginLink, function (err, resp, body) {
            expect(err).to.be.null;

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
              expect(err).to.be.null;
              var $ = cheerio.load(body);

              // follow redirect, deliver code
              var redirectCallbackURL = $('#redirecting').attr('href');
              jarRequest.get(redirectCallbackURL, function (err, resp, body) {
                expect(err).to.be.null;
                var $ = cheerio.load(body);

                // verify token.
                var accessToken = $('#access_token').text().replace(/(^"|"$)/g, '');
                console.log(accessToken);
                lib.webToken.verify(accessToken, function (err, value) {
                  expect(err).to.be.null;
                  expect(value).to.be.an('object');

                  clientServer.close();
                  server.close();
                  done();
                });
              });
            });
          });
        });
      });
    });  // once listening
  });

  it.only('Successfully issues a valid jwt token with redirects', function (done) {
    // set doNotRedirect to false
    var config = require('../config');
    config.doNotRedirect = false;

    // get resource owner
    var jarRequest = request.defaults({ jar: true });

    // get server
    var server = http.createServer(app);
    server.listen(4000);
    server.once('error', (error) => { expect(error).to.be.null; done(); });
    server.once('listening', () => {
      var clientServer = http.createServer(clientApp);
      clientServer.listen(4001);
      clientServer.once('error', (error) => { expect(error).to.be.null; done(); });
      clientServer.once('listening', () => {

        // visit client
        jarRequest.get('http://localhost:4001', function (err, resp, body) {
          expect(err).to.be.null;
          var $ = cheerio.load(body);
          var loginLink = $('#link').attr('href');

          // goto login/authorize
          jarRequest.get(loginLink, function (err, resp, body) {
            expect(err).to.be.null;

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
              expect(err).to.be.null;

              // follow redirect, deliver code
              var redirectCallbackURL = resp.headers.location;
              expect(validUrl.isUri(redirectCallbackURL)).to.not.be.undefined;

              jarRequest.get(redirectCallbackURL, function (err, resp, body) {
                expect(err).to.be.null;
                var $ = cheerio.load(body);

                // verify token.
                var accessToken = $('#access_token').text().replace(/(^"|"$)/g, '');
                console.log(accessToken);
                lib.webToken.verify(accessToken, function (err, value) {
                  expect(err).to.be.null;
                  expect(value).to.be.an('object');

                  clientServer.close();
                  server.close();
                  done();
                });
              });
            });
          });
        });
      });
    });  // once listening
  });
});
