var expect = require('chai').expect;

var lib = require('../lib');

describe('Tests functionality of CodeStore', function () {
  it('should be able to store and get', function (done) {
    var cs = new lib.CodeStore();
    cs.store('code', 'user', ['scope1', 'scope2'], 'samplestate');

    var code = cs.get('code');
    expect(code).to.deep.equal({
      code: 'code',
      user   : 'user',
      scopes : [ 'scope1', 'scope2' ],
      state  : 'samplestate'
    });
    done();
  });

  it('should return null when no code found', function (done) {
    var cs = new lib.CodeStore();
    cs.store('code', 'user', ['scope1', 'scope2'], 'samplestate');

    var code = cs.get('code1');
    expect(code).to.be.null;
    done();
  });

  it('should return the correct code object', function (done) {
    var cs = new lib.CodeStore();
    cs.store('code1', 'user1', ['scope1', 'scope2'], 'samplestate41');
    cs.store('code2', 'user2', ['scope1', 'scope2'], 'samplestate52');
    cs.store('code3', 'user3', ['scope1', 'scope2'], 'samplestate63');

    var code = cs.get('code2');
    expect(code).to.deep.equal({
      code: 'code2',
      user   : 'user2',
      scopes : [ 'scope1', 'scope2' ],
      state  : 'samplestate52'
    });
    done();
  });
});
