module.exports = {
  '/': require('../pages/companies'),
  '/people': require('../pages/people'),
  '/people/:personId': require('../pages/person'),
  '/:companySlug': require('../pages/company'),
  '/:companySlug/jobs/:jobSlug': require('../pages/company-job'),
  '/:companySlug/messages/:surveyMessageId': require('../pages/company-survey-message')
}
