const path = require('path')
const { combineReducers } = require('redux')

const initialiseClient = require('@nudj/framework/client')
const { routerReducer } = require('@nudj/react-router-redux')
const appReducer = require('@nudj/framework/lib/redux/reducer')
const createReactRoutes = require('@nudj/framework/lib/redux/create-react-routes')

const App = require('./redux')
const routes = createReactRoutes(require('./redux/routes'))
const reducers = require('./redux/reducers')

const { store, render } = initialiseClient(reducers)
render(App, routes)

if (module.hot) {
  module.hot.accept('./redux/reducers', () => {
    const newReducers = require('./redux/reducers')

    const rootReducer = combineReducers({
      router: routerReducer,
      app: appReducer,
      ...newReducers
    })

    store.replaceReducer(rootReducer)
  })

  module.hot.accept([
    './redux',
    './redux/routes',
    path.resolve('/pages'),
    path.resolve('./components')
  ], () => {
    const newApp = require('./redux')
    const newRoutes = createReactRoutes(require('./redux/routes'))

    render(newApp, newRoutes)
  })
}
