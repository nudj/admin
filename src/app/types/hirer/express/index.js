const router = require('../../../lib/item/router')
const fetchers = require('./fetchers')

module.exports = router({
  singular: 'hirer',
  plural: 'hirers',
  fetchers
})
