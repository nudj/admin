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
const path = require('path')
const server = require('@nudj/framework/server')
const logger = require('@nudj/framework/logger')
const find = require('lodash/find')

const reactApp = require('./redux')
const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')
const LoadingComponent = require('./components/loading')
const mockData = require('./mock-data')

const expressAssetPath = path.join(__dirname, 'server/assets')
const buildAssetPath = path.join(__dirname, 'server/build')
const expressRouters = {
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

const spoofLoggedIn = (req, res, next) => {
  req.session.data = req.session.data || {
    hirer: find(mockData.hirers, { id: 'hirer1' }),
    person: find(mockData.people, { id: 'person5' })
  }
  next()
}
const errorHandlers = {}

const { app, getMockApiApps } = server({
  App: reactApp,
  reduxRoutes,
  reduxReducers,
  mockData,
  expressAssetPath,
  buildAssetPath,
  expressRouters,
  spoofLoggedIn,
  errorHandlers,
  LoadingComponent
})

app.listen(80, () => {
  logger.log('info', 'Application running')
})

if (process.env.USE_MOCKS === 'true') {
  const { jsonServer, gqlServer } = getMockApiApps({ data: mockData })

  jsonServer.listen(81, () => {
    logger.log('info', 'JSONServer running')
  })

  gqlServer.listen(82, () => {
    logger.log('info', 'Mock GQL running')
  })
}
