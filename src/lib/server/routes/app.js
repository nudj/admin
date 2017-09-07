const express = require('express')
const get = require('lodash/get')
const find = require('lodash/find')
const _ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const getTime = require('date-fns/get_time')
const {
  merge,
  promiseMap,
  addDataKeyValue
} = require('@nudj/library')

const logger = require('../lib/logger')
const companies = require('../modules/companies')
const fetchersCompanies = require('../../routes/companies/companies-fetchers')
const fetchersPeople = require('../../routes/people/people-fetchers')
const fetchersPerson = require('../../routes/person/person-fetchers')
const fetchersCompany = require('../../routes/company/company-fetchers')
const fetchersCompanyJob = require('../../routes/company-job/company-job-fetchers')
const surveys = require('../modules/surveys')
const jobs = require('../modules/jobs')
const hirers = require('../modules/hirers')
const messages = require('../modules/messages')
const people = require('../modules/people')
const tasks = require('../modules/tasks')
const app = require('../../app/server')

const router = express.Router()

function spoofLoggedIn (req, res, next) {
  const data = require('../../../mocks/api/dummy-data')
  req.session.data = req.session.data || {
    hirer: find(data.hirers, { id: 'hirer1' }),
    person: find(data.people, { id: 'person5' })
  }
  return next()
}

function doEnsureLoggedIn (req, res, next) {
  if (req.session.logout) {
    let url = req.originalUrl.split('/')
    url.pop()
    res.redirect(url.join('/'))
  } else {
    if (req.xhr) {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).send()
      }
    }
    _ensureLoggedIn(req, res, next)
  }
  delete req.session.logout
}

const spoofUser = process.env.SPOOF_USER === 'true'
const ensureLoggedIn = spoofUser ? spoofLoggedIn : doEnsureLoggedIn

function getRenderDataBuilder (req) {
  return (data) => {
    data.csrfToken = req.csrfToken()
    if (req.session.data) {
      req.session.data.person = data.person || req.session.data.person
      data.person = req.session.data.person
    }
    if (req.session.notification) {
      data.notification = req.session.notification
      delete req.session.notification
    }
    data.url = {
      protocol: req.protocol,
      hostname: req.hostname,
      originalUrl: req.originalUrl
    }
    data.web = {
      protocol: req.protocol,
      hostname: process.env.WEB_HOSTNAME
    }
    return {
      page: data
    }
  }
}

function getErrorHandler (req, res, next) {
  return (error) => {
    try {
      let data, errorMessage
      switch (error.message) {
        // renders with message
        case 'Invalid url':
          errorMessage = {
            code: 400,
            error: 'error',
            message: 'Form submission data invalid'
          }
          data = getRenderDataBuilder(req)({
            message: errorMessage
          })
          getRenderer(req, res, next)(data)
          break
        // full page errors
        default:
          logger.log('error', error.message, error)
          switch (error.message) {
            case 'Not found':
              errorMessage = {
                code: 404,
                type: 'error',
                message: 'Not found'
              }
              break
            default:
              errorMessage = {
                code: 500,
                type: 'error',
                message: 'Something went wrong'
              }
          }
          data = getRenderDataBuilder(req)({
            error: errorMessage
          })
          getRenderer(req, res, next)(data)
      }
    } catch (error) {
      logger.log('error', error)
      next(error)
    }
  }
}

function getRenderer (req, res, next) {
  return (data) => {
    delete req.session.logout
    delete req.session.returnTo
    if (req.xhr) {
      return res.json(data)
    }
    let staticContext = app(data)
    if (staticContext.url) {
      res.redirect(staticContext.url)
    } else {
      let status = get(data, 'page.error.code', staticContext.status || 200)
      let person = get(data, 'page.person')
      res.status(status).render('app', {
        data: JSON.stringify(data),
        css: staticContext.css,
        html: staticContext.html,
        helmet: staticContext.helmet,
        intercom_app_id: `'${process.env.INTERCOM_APP_ID}'`,
        fullname: person && person.firstName && person.lastName && `'${person.firstName} ${person.lastName}'`,
        email: person && `'${person.email}'`,
        created_at: person && (getTime(person.created) / 1000)
      })
    }
  }
}

function respondWith (dataFetcher) {
  return (req, res, next) => {
    return dataFetcher({
      data: merge(req.session.data),
      params: req.params,
      body: req.body,
      req
    })
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
  }
}

function hirerSmooshing (data) {
  return people.getAll(data)
    .then(data => hirers.getAllByCompany(data, data.company.id))
    .then(data => {
      const expandedHirers = data.hirers.map(hirer => {
        const person = data.people.find(person => person.id === hirer.person)
        return merge({}, hirer, {person})
      })
      data.hirers = expandedHirers
      return promiseMap(data)
    })
}

function addCompanyTaskHandler (req, res, next) {
  const companySlug = req.params.companySlug

  Promise.resolve(merge(req.session.data))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => {
      const company = data.company.id
      const type = req.params.taskType
      const task = {company, type}
      return tasks.post(data, task)
    })
    .then(data => {
      data.notification = {
        message: `New ${data.newTask.type} task saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('companies', companies.getAll))
    .then(data => jobs.getAll(data, data.company.id))
    .then(hirerSmooshing)
    .then(data => tasks.getAllByCompany(data, data.company.id))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function surveyMessageHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const surveyMessageId = req.params.surveyMessageId

  Promise.resolve(merge(req.session.data))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => messages.getOneById(data, surveyMessageId))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function addCompanySurveyLinkHandler (req, res, next) {
  const companySlug = req.params.companySlug
  surveys.post(merge(req.session.data), req.body)
    .then(data => {
      data.notification = {
        message: `Survey link added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => jobs.getAll(data, data.company.id))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(hirerSmooshing)
    .then(data => messages.getAllFor(data, data.company.id))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function updateCompanySurveyLinkHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const surveyId = req.params.surveyId
  surveys.patch(merge(req.session.data), surveyId, req.body)
    .then(data => {
      data.notification = {
        message: `Survey link updated`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => jobs.getAll(data, data.company.id))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(hirerSmooshing)
    .then(data => messages.getAllFor(data, data.company.id))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

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
router.post('/:companySlug/jobs', respondWith(fetchersCompany.postJob))
router.get('/:companySlug/jobs/:jobSlug', respondWith(fetchersCompanyJob.get))
router.put('/:companySlug/jobs/:jobSlug', respondWith(fetchersCompanyJob.put))
router.post('/:companySlug/jobs/:jobSlug/referrals', respondWith(fetchersCompanyJob.postReferral))
router.post('/:companySlug/jobs/:jobSlug/referrals/:personId', respondWith(fetchersCompanyJob.postReferralPerson))
router.post('/:companySlug/hirers', respondWith(fetchersCompany.postHirer))
router.post('/:companySlug/hirers/:person', respondWith(fetchersCompany.postHirerPerson))
router.get('/:companySlug/messages/:surveyMessageId', surveyMessageHandler)
router.post('/:companySlug/surveys', addCompanySurveyLinkHandler)
router.patch('/:companySlug/surveys/:surveyId', updateCompanySurveyLinkHandler)
router.post('/:companySlug/tasks/:taskType', addCompanyTaskHandler)

router.get('*', (req, res) => {
  let data = getRenderDataBuilder(req)({})
  getRenderer(req, res)(data)
})

module.exports = router
