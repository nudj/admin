const client = require('@nudj/framework/client')

const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')

client({
  reduxRoutes,
  reduxReducers
})
