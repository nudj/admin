require('babel-register')({
  presets: ['react'],
  ignore: function (filename) {
    if (filename.match(/@nudj/) || filename.match(/app/)) {
      return false
    }
    return true
  }
})
const path = require('path')
const server = require('@nudj/framework/server')
const logger = require('@nudj/framework/logger')
const find = require('lodash/find')

const App = require('./redux')
const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')
const mockData = require('./mock-data')

const expressAssetPath = path.join(__dirname, 'server/assets')
const expressRouters = {
  insecure: [],
  secure: [
    require('./server/routers/auth'),
    require('./pages/companies/router'),
    require('./pages/people/router'),
    require('./pages/person/router'),
    require('./pages/company/router'),
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
console.log('App', App)
server({
  App,
  reduxRoutes,
  reduxReducers,
  mockData,
  expressAssetPath,
  expressRouters,
  spoofLoggedIn,
  errorHandlers
})
