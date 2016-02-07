'use strict'

// external modules
var _ = require('lodash')

// default configuration
var Default_options = require('./default-options.js')

var HapiTokenCookie = require('./lib/hapi-token-cookie')
var ExpressTokenCookie = require('./lib/express-token-cookie')

var error = require('eraro')({
  package: 'auth-token-cookie'
})


module.exports = function (options) {
  var seneca = this
  var internals = {}
  internals.accepted_framworks = [
    'express',
    'hapi'
  ]
  internals.options = _.extend({}, Default_options, options || {})

  internals.choose_framework = function () {
    if ('express' === internals.options.framework) {
      internals.load_express_implementation()
    }
    else {
      internals.load_hapi_implementation()
    }
  }

  internals.check_options = function () {
    if (seneca.options().plugin.web && seneca.options().plugin.web.framework) {
      internals.options.framework = seneca.options().plugin.web.framework
    }

    if (_.indexOf(internals.accepted_framworks, internals.options.framework) === -1) {
      throw error('Framework type <' + internals.options.framework + '> not supported.')
    }
  }

  internals.load_express_implementation = function () {
    seneca.use(ExpressTokenCookie, internals.options)
  }

  internals.load_hapi_implementation = function () {
    seneca.use(HapiTokenCookie, internals.options)
  }

  function init(args, done){
    internals.check_options()
    internals.choose_framework()

    done()
  }

  seneca.add('init: auth-token-cookie', init)

  return {
    name: 'auth-token-cookie'
  }
}
