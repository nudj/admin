const types = require('../types')
const typeRoutes = types.reduce((routes, type) => {
  const typeRoutes = require('../types/' + type + '/redux')
  return {
    ...routes,
    ...typeRoutes
  }
}, {})

module.exports = {
  '/': require('../pages/companies'),
  ...typeRoutes,
  '/people': require('../pages/people'),
  '/surveys': require('../pages/surveys'),
  '/surveys/new': require('../pages/survey'),
  '/surveys/:id': require('../pages/survey'),
  '/survey-questions': require('../pages/survey-questions'),
  '/surveys/:surveyId/questions': require('../pages/survey-related-questions'),
  '/surveys/:surveyId/questions/new': require('../pages/survey-question'),
  '/surveys/:surveyId/questions/:questionId': require('../pages/survey-question'),
  '/people/:personId': require('../pages/person'),
  '/companies/:companySlug': require('../pages/company'),
  '/companies/:companySlug/jobs/:jobSlug': require('../pages/company-job')
}
