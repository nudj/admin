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

const reduxRoutes = require('./redux/routes')
const reduxReducers = require('./redux/reducers')
const expressRouters = [
  require('./server/routers/auth'),
  require('./pages/companies/router'),
  require('./pages/people/router'),
  require('./pages/person/router'),
  require('./pages/company/router'),
  require('./pages/company-job/router'),
  require('./pages/company-survey-message/router'),
  require('./server/routers/catch-all')
]
const expressAssetPath = path.join(__dirname, 'server/assets')
const mockData = require('./mock-data')

server({
  reduxRoutes,
  reduxReducers,
  expressRouters,
  expressAssetPath,
  mockData
})
