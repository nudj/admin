module.exports = {
  '/': require('../pages/companies'),
  '/people': require('../pages/people'),
  '/surveys': require('../pages/surveys'),
  '/survey/new': require('../pages/survey'),
  '/survey/:id': require('../pages/survey'),
  '/survey-questions': require('../pages/survey'),
  '/survey-question/new': require('../pages/survey-question'),
  '/survey-question/:id': require('../pages/survey-question'),
  '/section/:sectionId/questions': require('../pages/survey-section-relations'),
  '/survey-sections': require('../pages/survey-sections'),
  '/survey-section/new': require('../pages/survey-section'),
  '/survey-section/:id': require('../pages/survey-section'),
  '/people/:personId': require('../pages/person'),
  '/companies/:companySlug': require('../pages/company'),
  '/companies/:companySlug/jobs/:jobSlug': require('../pages/company-job'),
  '/companies/:companySlug/messages/:surveyMessageId': require('../pages/company-survey-message')
}
