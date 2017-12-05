module.exports = {
  '/': require('../pages/companies'),
  '/people': require('../pages/people'),
  '/surveys': require('../pages/surveys'),
  '/surveys/new': require('../pages/survey'),
  '/surveys/:id': require('../pages/survey'),
  '/surveys/:surveyId/sections': require('../pages/survey-relations'),
  '/survey-sections': require('../pages/survey-sections'),
  '/survey-sections/new': require('../pages/survey-section'),
  '/survey-sections/:id': require('../pages/survey-section'),
  '/survey-sections/:sectionId/questions': require('../pages/survey-section-relations'),
  '/survey-questions': require('../pages/survey'),
  '/survey-questions/new': require('../pages/survey-question'),
  '/survey-questions/:id': require('../pages/survey-question'),
  '/people/:personId': require('../pages/person'),
  '/companies/:companySlug': require('../pages/company'),
  '/companies/:companySlug/jobs/:jobSlug': require('../pages/company-job'),
  '/companies/:companySlug/messages/:surveyMessageId': require('../pages/company-survey-message')
}
