var expect = require('chai').expect;

var lib = require('../lib');

describe('access_token jwt signing module', function () {
  it('should basically work', function (done) {
    var data = { ok: 'nope' };
    var signed = lib.webToken.sign(data);

    lib.webToken.verify(signed, function (err, verified) {
      expect(err).to.be.null;
      for (var key in data)
        expect(verified[key]).to.deep.equal(data[key]);

      done();
    });
  });
});
