"use strict";

module.exports = function ( options ) {
  var seneca = this
  var plugin = 'seneca-auth-token-plugin'

  function setToken(args, cb){
    var tokenkey  = args.tokenkey
    var token     = args.token
    var res       = seneca.res$

    res.seneca.cookies.set( tokenkey, token )

    cb(null, {token: token})
  }

  function getToken(args, cb){
    var tokenkey  = args.tokenkey
    var req       = seneca.req$
    cb(null, {token: req.seneca.cookies.get( tokenkey )})
  }

  seneca.add({role: 'auth', set: 'token'}, setToken)
  seneca.add({role: 'auth', get: 'token'}, getToken)

  return {
    name:plugin
  }
}
