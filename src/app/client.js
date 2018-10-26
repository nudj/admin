const initialiseClient = require('@nudj/framework/client')
const createReactRoutes = require('@nudj/framework/lib/redux/create-react-routes')

const App = require('./redux')
const routes = createReactRoutes(require('./redux/routes'))
const reducers = require('./redux/reducers')

const client = initialiseClient(reducers)
client.render(App, routes)
