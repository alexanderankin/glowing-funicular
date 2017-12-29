describe('Integration Tests', function () {
  describe('Authorization Code Grant Flow', function () {
    require('./integration/authcode/authorizationFlowSuccess');
    require('./integration/authcode/configPaths');
  });
});
