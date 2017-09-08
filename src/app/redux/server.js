let React = require('react')
let ReactDOMServer = require('react-dom/server')
let { StaticRouter } = require('react-router-dom')
let { Provider } = require('react-redux')
let { createStore, combineReducers, applyMiddleware } = require('redux')
let { Helmet } = require('react-helmet')
let { StyleSheetServer } = require('aphrodite/no-important')
let thunkMiddleware = require('redux-thunk').default

let { serverReducer } = require('./reducers/server')

module.exports = (data) => {
  const store = createStore(
    combineReducers({
      server: serverReducer
    }),
    data,
    applyMiddleware(thunkMiddleware)
  )
  const context = {}
  const { html, css } = StyleSheetServer.renderStatic(() => {
    const Routes = require('./routes')
    return ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter
          location={data.server.url.originalUrl}
          context={context}
        >
          <Routes />
        </StaticRouter>
      </Provider>
    )
  })
  context.html = html
  context.css = css
  context.helmet = Helmet.renderStatic()
  return context
}
