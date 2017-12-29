var expect = require('chai').expect;

var ClientStore = require('../lib').ClientStore;

describe('Tests functionality of ClientStore', function () {
  it('should register new clients', function (done) {
    var clientStore = new ClientStore();
    clientStore.register('id', 'secret', ['http://localhost/callback']);

    done();
  });

  it('should not register duplicates', function (done) {
    var clientStore = new ClientStore();

    var bad = function() {
      clientStore.register('id', 'secret', ['http://localhost/callback']);
      clientStore.register('id', 'secret', ['http://localhost/callback']);
    };

    expect(bad).to.throw();
    done();
  });

  it('should find newly registered clients', function (done) {
    var clientStore = new ClientStore();
    clientStore.register('id', 'secret', ['http://localhost/callback']);
    clientStore.register('id1', 'secret1', ['http://localhost/callback']);

    var found = clientStore.verifyClient('id');
    expect(found).to.satisfy(function(e) { return e; });
    done();
  });

  it('should throw on bad url', function (done) {
    var clientStore = new ClientStore();
    var bad = function() { clientStore.register('i', 's', ['bad']); };

    expect(bad).to.throw();
    done();
  });

  it('should validate id, id/secret pairs', function (done) {
    var cS = new ClientStore();
    cS.register('id', 'secret', ['http://localhost/callback']);
    cS.register('id1', 'secret1', ['http://localhost/callback']);

    var truthy = function(e) { return e; };
    expect(cS.verifyClient('id')).to.satisfy(truthy);
    expect(cS.verifyClient('id1')).to.satisfy(truthy);
    expect(cS.verifyClient('id2')).to.not.satisfy(truthy);
    expect(cS.verifyClient('id3')).to.not.satisfy(truthy);

    expect(cS.verifyClientSecret('id', 'secret')).to.satisfy(truthy);
    expect(cS.verifyClientSecret('id1', 'secret1')).to.satisfy(truthy);
    expect(cS.verifyClientSecret('id', 'secret1')).to.not.satisfy(truthy);
    expect(cS.verifyClientSecret('id1', 'secret')).to.not.satisfy(truthy);
    done();
  });

  it('should verify a client\'s urls', function (done) {
    var cS = new ClientStore();
    cS.register('id', 'secret', ['http://localhost/callback']);
    cS.register('id1', 'secret1', ['http://localhost/callback1']);
    
    var verified;
    var truthy = function(e) { return e; };

    verified = cS.verifyUrl('id', 'http://localhost/callback');
    expect(verified).to.satisfy(truthy);
    verified = cS.verifyUrl('id', 'http://localhost/callback1');
    expect(verified).to.not.satisfy(truthy);
    verified = cS.verifyUrl('id1', 'http://localhost/callback1');
    expect(verified).to.satisfy(truthy);
    verified = cS.verifyUrl('id1', 'http://localhost/callback');
    expect(verified).to.not.satisfy(truthy);
    verified = cS.verifyUrl('id2', 'http://localhost/callback');
    expect(verified).to.not.satisfy(truthy);
    done();
  });
});
