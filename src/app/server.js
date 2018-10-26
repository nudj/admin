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

const reactApp = require('./redux')
const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')
const LoadingComponent = require('./components/loading')
const getAnalytics = require('./server/lib/getAnalytics')

const expressAssetPath = path.resolve('./app/server/assets')
const buildAssetPath = path.resolve('./app/server/build')
const types = require('./types')

const expressRouters = {
  insecure: [
    require('./server/routers/health-check')
  ],
  secure: [
    require('./server/routers/auth'),
    ...types.map(type => require('./types/' + type + '/express')),
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
    require('./server/routers/catch-all')
  ]
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
        "'self'",
        'api.mixpanel.com'
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

const app = createNudjApps({
  App: reactApp,
  reduxRoutes,
  reduxReducers,
  expressAssetPath,
  buildAssetPath,
  expressRouters,
  errorHandlers,
  LoadingComponent,
  helmetConfig,
  getAnalytics
})

http.createServer(app).listen(process.env.API_PORT, () => {
  logger.log('info', 'Application running')
})
