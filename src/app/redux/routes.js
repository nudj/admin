module.exports = {
  '/': require('../routes/companies/page'),
  '/people': require('../routes/people/page'),
  '/people/:personId': require('../routes/person/page'),
  '/:companySlug': require('../routes/company/page'),
  '/:companySlug/jobs/:jobSlug': require('../routes/company-job/page'),
  '/:companySlug/messages/:surveyMessageId': require('../routes/company-survey-message/page')
}
