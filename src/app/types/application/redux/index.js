const reduxRoutes = require('../../../lib/item/redux-routes')
const List = require('./list')
const View = require('./view')

module.exports = reduxRoutes({
  singular: 'application',
  plural: 'applications',
  List,
  View
})
