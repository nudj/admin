require('babel-register')({
  presets: ['react'],
  ignore: function (filename) {
    if (filename.match(/@nudj/) || filename.match(/app/) || filename.match(/framework/)) {
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
  require('./server/routers/app')
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
