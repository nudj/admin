const client = require('@nudj/framework/client')

const App = require('./redux')
const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')

client({
  App,
  reduxRoutes,
  reduxReducers
})
