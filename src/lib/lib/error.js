const logger = require('./logger')

function NudjError (message, type, data) {
  this.message = message
  this.type = type
  this.data = data
  Error.captureStackTrace(this, NudjError)
  logger.log('error', this)
}
NudjError.prototype = Object.assign({}, Error.prototype)
NudjError.prototype.name = 'NudjError'

module.exports = NudjError
