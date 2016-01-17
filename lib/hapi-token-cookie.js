'use strict'

var error = require('eraro')({
  package: 'auth-token-cookie'
})

module.exports = function (options) {
  var seneca = this
  var internals = {}

  internals.init = function (msg, done){
    seneca.act('role: web, get: server', function (err, data) {
      if (err) {
        throw new error('Cannot retrieve server: ' + err)
      }

      if (!data) {
        throw new error('Cannot retrieve server')
      }

      var server = data.server

      server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'seneca-login',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: function (req, session, callback) {
          req.seneca.act('role: web, do: startware', {token: session['seneca-login']}, function (err) {
            if (err) {
              return callback(null, false)
            }
            else {
              callback(null, true)
            }
          })
        }
      })

      done && done()
    })
  }

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

  seneca.add('init: auth-token-cookie', internals.init)

  // @hack - need to see why is not working
  internals.init()
}
