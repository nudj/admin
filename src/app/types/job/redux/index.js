const reduxRoutes = require('../../../lib/item/redux-routes')
const List = require('./list')
const View = require('./view')

module.exports = reduxRoutes({
  singular: 'job',
  plural: 'jobs',
  List,
  View
})
