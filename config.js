module.exports = {
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
