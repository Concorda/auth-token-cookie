'use strict'

// external modules
var _ = require('lodash')

// default configuration
var Default_options = require('./default-options.js')

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
      options.framework = seneca.options().plugin.web.framework
    }

    if (_.indexOf(internals.accepted_framworks, internals.options.framework) === -1) {
      throw error('Framework type <' + internals.options.framework + '> not supported.')
    }
  }

  internals.load_express_implementation = function () {
    seneca.use(require('./lib/express-token-cookie'), internals.options)
  }

  internals.load_hapi_implementation = function () {
    seneca.use(require('./lib/hapi-token-cookie'), internals.options)
  }

  internals.check_options()
  internals.choose_framework()
}
