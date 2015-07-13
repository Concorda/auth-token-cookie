"use strict";

module.exports = function ( options ) {
  var seneca = this
  var plugin = 'seneca-auth-token-plugin'

  seneca.add({role: 'token', cmd: 'set'}, function(args, cb){
    var tokenkey  = args.tokenkey
    var token     = args.token
    var res       = args.res
    var req       = args.req

    res.seneca.cookies.set( tokenkey, token )

    cb(null, {token: token})
  })

  seneca.add({role: 'token', cmd: 'get'}, function(args, cb){
    var tokenkey  = args.tokenkey
    var res       = args.res
    var req       = args.req
    cb(null, {token: req.seneca.cookies.get( tokenkey )})
  })

  return {
    name:plugin
  }
}
