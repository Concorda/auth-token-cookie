"use strict";

module.exports = function ( options ) {
  var seneca = this
  var plugin = 'auth-auth-toke-plugin'

  seneca.add({role: 'token', cmd: 'set'}, function(args, cb){
    var tokenkey  = args.tokenkey
    var token     = args.token
    var res       = args.res
    var req       = args.req

    res.cookies.set( tokenkey, token )

    cb(null, {token: token})
  })

  seneca.add({role: 'token', cmd: 'get'}, function(args, cb){
    var tokenkey  = args.tokenkey
    var res       = args.res
    var req       = args.req
    cb(null, {token: req.cookies.get( tokenkey )})
  })

  return {
    name:plugin
  }
}
