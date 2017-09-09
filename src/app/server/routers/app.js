const express = require('express')

const fetchersCompanies = require('../../routes/companies/fetchers')
const fetchersPeople = require('../../routes/people/fetchers')
const fetchersPerson = require('../../routes/person/fetchers')
const fetchersCompany = require('../../routes/company/fetchers')
const fetchersCompanyJob = require('../../routes/company-job/fetchers')
const fetchersCompanySurveyMessage = require('../../routes/company-survey-message/fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/', respondWith(fetchersCompanies.get))
  router.post('/', respondWith(fetchersCompanies.post))

  router.get('/people', respondWith(fetchersPeople.get))
  router.post('/people', respondWith(fetchersPeople.post))
  router.get('/people/:personId', respondWith(fetchersPerson.get))
  router.put('/people/:personId', respondWith(fetchersPerson.put))
  router.post('/people/:personId/referrals/:jobSlug', respondWith(fetchersPerson.postReferral))
  router.post('/people/:personId/recommendations/:jobSlug', respondWith(fetchersPerson.postRecommendation))
  router.post('/people/:personId/tasks/:taskType', respondWith(fetchersPerson.postTask))

  router.get('/:companySlug', respondWith(fetchersCompany.get))
  router.put('/:companySlug', respondWith(fetchersCompany.put))
  router.post('/:companySlug/hirers', respondWith(fetchersCompany.postHirer))
  router.post('/:companySlug/hirers/:person', respondWith(fetchersCompany.postHirerPerson))
  router.post('/:companySlug/surveys', respondWith(fetchersCompany.postSurvey))
  router.patch('/:companySlug/surveys/:surveyId', respondWith(fetchersCompany.patchSurvey))
  router.post('/:companySlug/tasks/:taskType', respondWith(fetchersCompany.postTask))

  router.post('/:companySlug/jobs', respondWith(fetchersCompany.postJob))
  router.get('/:companySlug/jobs/:jobSlug', respondWith(fetchersCompanyJob.get))
  router.put('/:companySlug/jobs/:jobSlug', respondWith(fetchersCompanyJob.put))
  router.post('/:companySlug/jobs/:jobSlug/referrals', respondWith(fetchersCompanyJob.postReferral))
  router.post('/:companySlug/jobs/:jobSlug/referrals/:personId', respondWith(fetchersCompanyJob.postReferralPerson))

  router.get('/:companySlug/messages/:surveyMessageId', respondWith(fetchersCompanySurveyMessage.get))

  router.get('*', respondWith(() => ({})))

  return router
}

module.exports = Router
