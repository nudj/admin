const reduxRoutes = require('../../../lib/item/redux-routes')
const List = require('./list')

module.exports = reduxRoutes({
  singular: 'referral',
  plural: 'referrals',
  List
})
