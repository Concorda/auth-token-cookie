"use strict";

// external modules
var _ = require('lodash')
var Cookies       = require('cookies')

// default configuration
var default_options = require('./default-options.js')

module.exports = function ( options ) {
  var seneca = this

  options = _.extend({}, default_options, options || {})

  function set_token ( args, cb ) {
    var tokenkey  = args.tokenkey || options.tokenkey
    var token     = args.token
    var res       = this.fixedargs.res$
    var req       = this.fixedargs.req$

    if ( !res.seneca.cookies ) {
      res.seneca.cookies = new Cookies( req, res )
    }

    res.seneca.cookies.set( tokenkey, token )

    cb( null, {token: token} )
  }


  function get_token( args, cb ) {
    var tokenkey  = args.tokenkey || options.tokenkey
    var res       = this.fixedargs.res$
    var req       = this.fixedargs.req$

    if ( !req.seneca.cookies ) {
      req.seneca.cookies = new Cookies( req, res )
    }

    cb( null, {token: req.seneca.cookies.get( tokenkey )} )
  }


  seneca.add( {role: 'auth', set: 'token'}, set_token )
  seneca.add( {role: 'auth', get: 'token'}, get_token )
}
