require('envkey')
require('babel-register')({
  presets: ['react'],
  ignore: function (filename) {
    if (
      filename.match(
        /\/usr\/src\/((?=.*@nudj)(?!.*\/node_modules).*)|\/usr\/src\/app/
      )
    ) {
      return false
    }
    return true
  }
})

const http = require('http')
const path = require('path')
const createNudjApps = require('@nudj/framework/server')
const logger = require('@nudj/framework/logger')
const find = require('lodash/find')

const reactApp = require('./redux')
const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')
const LoadingComponent = require('./components/loading')
const mockData = require('./mock-data')

const useDevServer = process.env.USE_DEV_SERVER === 'true'

const expressAssetPath = path.resolve('./app/server/assets')
const buildAssetPath = !useDevServer && path.resolve('./app/server/build')

const expressRouters = {
  insecure: [
    require('./server/routers/health-check')
  ],
  secure: [
    require('./server/routers/auth'),
    require('./pages/companies/router'),
    require('./pages/people/router'),
    require('./pages/person/router'),
    require('./pages/company/router'),
    require('./pages/surveys/router'),
    require('./pages/survey/router'),
    require('./pages/survey-relations/router'),
    require('./pages/survey-section/router'),
    require('./pages/survey-sections/router'),
    require('./pages/survey-section-relations/router'),
    require('./pages/survey-questions/router'),
    require('./pages/survey-question/router'),
    require('./pages/company-job/router'),
    require('./pages/company-survey-message/router'),
    require('./server/routers/catch-all')
  ]
}

const spoofLoggedIn = (req, res, next) => {
  req.session.data = req.session.data || {
    hirer: find(mockData.hirers, { id: 'hirer1' }),
    person: find(mockData.people, { id: 'person5' })
  }
  next()
}
const errorHandlers = {}

const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'tagmanager.google.com',
        'www.googletagmanager.com'
      ],
      connectSrc: [
        "'self'"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'cdnjs.cloudflare.com'
      ],
      fontSrc: [
        "'self'"
      ],
      imgSrc: [
        "'self'"
      ]
    }
  }
}
if (useDevServer) {
  helmetConfig.contentSecurityPolicy.directives.scriptSrc.push('admin-wds.local.nudj.co')
  helmetConfig.contentSecurityPolicy.directives.connectSrc.push('admin-wds.local.nudj.co')
  helmetConfig.contentSecurityPolicy.directives.connectSrc.push('wss://admin-wds.local.nudj.co')
  helmetConfig.contentSecurityPolicy.directives.scriptSrc.push("'unsafe-eval'")
}

let app = createNudjApps({
  App: reactApp,
  reduxRoutes,
  reduxReducers,
  mockData,
  expressAssetPath,
  buildAssetPath,
  expressRouters,
  spoofLoggedIn,
  errorHandlers,
  LoadingComponent,
  helmetConfig
})

const server = http.createServer(app)

server.listen(80, () => {
  logger.log('info', 'Application running')
})

if (module.hot) {
  module.hot.accept([
    './redux',
    './redux/routes',
    './redux/reducers',
    path.resolve('./pages'),
    path.resolve('./components'),
    './server/routers/auth',
    './pages/companies/router',
    './pages/people/router',
    './pages/person/router',
    './pages/company/router',
    './pages/surveys/router',
    './pages/survey/router',
    './pages/survey-relations/router',
    './pages/survey-section/router',
    './pages/survey-sections/router',
    './pages/survey-section-relations/router',
    './pages/survey-questions/router',
    './pages/survey-question/router',
    './pages/company-job/router',
    './pages/company-survey-message/router',
    './server/routers/catch-all'
  ], () => {
    const updatedReactApp = require('./redux')
    const updatedReduxRoutes = require('./redux/routes')
    const updatedReduxReducers = require('./redux/reducers')
    const updatedLoadingPage = require('./components/loading')
    const updatedExpressRouters = {
      insecure: [],
      secure: [
        require('./server/routers/auth'),
        require('./pages/companies/router'),
        require('./pages/people/router'),
        require('./pages/person/router'),
        require('./pages/company/router'),
        require('./pages/surveys/router'),
        require('./pages/survey/router'),
        require('./pages/survey-relations/router'),
        require('./pages/survey-section/router'),
        require('./pages/survey-sections/router'),
        require('./pages/survey-section-relations/router'),
        require('./pages/survey-questions/router'),
        require('./pages/survey-question/router'),
        require('./pages/company-job/router'),
        require('./pages/company-survey-message/router'),
        require('./server/routers/catch-all')
      ]
    }

    server.removeListener('request', app)
    const newApp = createNudjApps({
      App: updatedReactApp,
      reduxRoutes: updatedReduxRoutes,
      reduxReducers: updatedReduxReducers,
      expressRouters: updatedExpressRouters,
      expressAssetPath,
      buildAssetPath,
      spoofLoggedIn,
      errorHandlers,
      LoadingComponent: updatedLoadingPage,
      helmetConfig
    })

    server.on('request', newApp)
    app = newApp
  })
}
