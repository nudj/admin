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
const server = require('../framework/server')

const customRouters = [
  require('./server/routers/auth'),
  require('./server/routers/app')
]
const reduxRoutes = {
  '/': require('./routes/companies/page'),
  '/people': require('./routes/people/page'),
  '/people/:personId': require('./routes/person/page'),
  '/:companySlug': require('./routes/company/page'),
  '/:companySlug/jobs/:jobSlug': require('./routes/company-job/page'),
  '/:companySlug/messages/:surveyMessageId': require('./routes/company-survey-message/page')
}
const customReducers = {}

server({
  customRouters,
  reduxRoutes,
  customReducers,
  customAssetPath: path.join(__dirname, 'server/assets')
})
