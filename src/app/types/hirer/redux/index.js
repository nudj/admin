const reduxRoutes = require('../../../lib/item/redux-routes')
const List = require('./list')
const View = require('./view')

module.exports = reduxRoutes({
  singular: 'hirer',
  plural: 'hirers',
  List,
  View
})
