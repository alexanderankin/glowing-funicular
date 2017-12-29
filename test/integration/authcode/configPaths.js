var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');

var expect = require('chai').expect;
var validUrl = require('valid-url');
var cheerio = require('cheerio');
var request = require('request');
var app = require('../../../app');
var clientApp = require('../../testClient/app');
var reload = require('require-reload')(require);

var lib = require('../../../lib');

describe.skip('Authorization Code Grant Flow', function () {
  after(function () {
    fs.writeFileSync(path.join(__dirname, '..', 'config.js'), `module.exports = {
  /**
   * This setting will be used whenever the server may issue a http 301 or 302
   * and will fall back on providing a clickable link.
   */
  doNotRedirect: true,
  /**
   * Configurable paths
   */
  paths: {
    authorization: '/authorize',
    login: '/loginpage',
    token: '/token',
    tokenVerification: '/check_token',
    tokenRefresh: '/refresh_token',
  }
};
`);
  });

  it('Successfully issues a valid jwt token', function (done) {
    var config = require('../../../config');
    config.paths = {
      authorization: '/authorize',
      login: '/loginpage',
      token: '/token',
      tokenVerification: '/check_token',
      tokenRefresh: '/refresh_token',
    };
    var newConfig = `module.exports = ${JSON.stringify(config)};`;
    fs.writeFileSync(path.join(__dirname, '..', 'config.js'), newConfig);
    // reload('../../../config');
    // reload('../../../app');

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

                  var firstDone = false;
                  var bothDone = function() {
                    if (firstDone) { done(); }
                    firstDone = true;
                  };
                  clientServer.on('close', bothDone);
                  server.on('close', bothDone);
                });
              });
            });
          });
        });
      });
    });  // once listening
  });
});
