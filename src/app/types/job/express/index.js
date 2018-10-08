const router = require('../../../lib/item/router')
const fetchers = require('./fetchers')

module.exports = router({
  singular: 'job',
  plural: 'jobs',
  fetchers
})
