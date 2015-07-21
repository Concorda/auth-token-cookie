"use strict";
var _ = require('lodash')
var default_options = require('./default-options.js')
var Cookies       = require('cookies')

module.exports = function ( options ) {
  var seneca = this
  var plugin = 'seneca-auth-token-plugin'
  options = _.extend({}, default_options, options)

  function setToken(args, cb){
    var tokenkey  = args.tokenkey || options.tokenkey
    var token     = args.token
    var res       = this.fixedargs.res$
    var req       = this.fixedargs.req$

    if (!res.seneca.cookies){
      res.seneca.cookies = new Cookies(req,res)
    }

    res.seneca.cookies.set( tokenkey, token )

    cb(null, {token: token})
  }

  function getToken(args, cb){
    var tokenkey  = args.tokenkey || options.tokenkey
    var res       = this.fixedargs.res$
    var req       = this.fixedargs.req$

    if (!req.seneca.cookies){
      req.seneca.cookies = new Cookies(req,res)
    }

    cb(null, {token: req.seneca.cookies.get( tokenkey )})
  }

  seneca.add({role: 'auth', set: 'token'}, setToken)
  seneca.add({role: 'auth', get: 'token'}, getToken)

  return {
    name:plugin
  }
}
