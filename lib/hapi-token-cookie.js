'use strict'

module.exports = function (options) {
  var seneca = this

  function set_token (msg, done) {
    var tokenkey = msg.tokenkey || options.tokenkey
    var token = msg.token

    var session = {}
    session[tokenkey] = token
    this.fixedargs.req$.cookieAuth.set(session)

    done(null, {token: token})
  }

  function get_token (msg, done) {
    if (msg.req$ && msg.req$.seneca && msg.req$.seneca.login) {
      return done(null, {token: msg.req$.seneca.login.id})
    }
    done()
  }

  seneca.add({role: 'auth', set: 'token'}, set_token)
  seneca.add({role: 'auth', get: 'token'}, get_token)
}
