module.exports = {
  '/': require('../pages/companies'),
  '/people': require('../pages/people'),
  '/surveys': require('../pages/surveys'),
  '/survey/new': require('../pages/survey/new'),
  '/survey/:id': require('../pages/survey/edit'),
  '/people/:personId': require('../pages/person'),
  '/companies/:companySlug': require('../pages/company'),
  '/companies/:companySlug/jobs/:jobSlug': require('../pages/company-job'),
  '/companies/:companySlug/messages/:surveyMessageId': require('../pages/company-survey-message')
}
