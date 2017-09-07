const express = require('express')
const get = require('lodash/get')
const find = require('lodash/find')
const _ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const getTime = require('date-fns/get_time')
const {
  merge,
  promiseMap,
  addDataKeyValue,
  actionMapAssign
} = require('@nudj/library')

const logger = require('../lib/logger')
const companies = require('../modules/companies')
const fetchersCompanies = require('../../routes/companies/companies-fetchers')
const fetchersPeople = require('../../routes/people/people-fetchers')
const fetchersPerson = require('../../routes/person/person-fetchers')
const surveys = require('../modules/surveys')
const jobs = require('../modules/jobs')
const hirers = require('../modules/hirers')
const messages = require('../modules/messages')
const network = require('../modules/network')
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

function respondWith (req, res, next) {
  return data => Promise.resolve(data)
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function respondWithData (dataFetcher) {
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

function editCompanyHandler (req, res, next) {
  // const companySlug = req.params.companySlug
  const company = req.body

  actionMapAssign(
    merge(req.session.data),
    {
      companies: () => companies.getAll(),
      company: () => companies.put(company)
    },
    {
      jobs: data => jobs.getAll(merge(data), data.company.id).then(data => data.jobs),
      notification: data => ({
        message: `${data.company.name} saved`,
        type: 'success'
      }),
      tasks: data => tasks.getAllByCompany(merge(data), data.company.id).then(data => data.tasks),
      surveyMessages: data => messages.getAllFor(merge(data), data.company.id).then(data => data.surveyMessages),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers)
    }
  )
  .then(respondWith(req, res, next))
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

function companyHandler (req, res, next) {
  const companySlug = req.params.companySlug

  actionMapAssign(
    merge(req.session.data),
    {
      company: () => companies.get(companySlug),
      companies: () => companies.getAll(),
      people: data => people.getAll(data).then(data => data.people)
    },
    {
      survey: data => surveys.getSurveyForCompany(merge(data)).then(data => data.survey),
      jobs: data => jobs.getAll(merge(data), data.company.id).then(data => data.jobs),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers),
      surveyMessages: data => messages.getAllFor(merge(data), data.company.id).then(data => data.surveyMessages),
      tasks: data => tasks.getAllByCompany(merge(data), data.company.id).then(data => data.tasks)
    }
  )
  .then(respondWith(req, res, next))
}

function addCompanyJobHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const job = req.body

  Promise.resolve(merge(req.session.data))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => {
      job.company = data.company.id
      return jobs.post(data, job)
    })
    .then(data => {
      data.notification = {
        message: `${data.newJob.title} added`,
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

function addCompanyHirer (req, res, next, data, company, person) {
  hirers.post(data, {company, person})
    .then(data => {
      data.notification = {
        message: `New hirer added`,
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

function addCompanyHirerHandler (req, res, next) {
  const companySlug = req.params.companySlug

  Promise.resolve(merge(req.session.data))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => addCompanyHirer(req, res, next, data, data.company.id, req.params.person))
}

function addPersonThenCompanyHirerHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const email = req.body.email

  Promise.resolve(merge(req.session.data))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => people.post(data, {email}))
    .then(data => addCompanyHirer(req, res, next, data, data.company.id, data.newPerson.id))
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

function genericGetJob ({data, req, res, next, companySlug}) {
  jobs.getReferrals(data, data.job.id)
    .then(data => jobs.getApplications(data, data.job.id))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => people.getAll(data))
    .then(data => {
      data.activities = jobs.getJobActivities(data, data.job.id)
      return promiseMap(data)
    })
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function jobHandler (req, res, next) {
  const companySlug = req.params.companySlug
  // Do we have an issue here with job-slug uniqueness across companies?
  jobs.get(merge(req.session.data), req.params.jobSlug)
    .then(jobs.getAll)
    .then(data => genericGetJob({data, req, res, next, companySlug}))
}

function editJobHandler (req, res, next) {
  const companySlug = req.params.companySlug
  jobs.put(merge(req.session.data), req.body)
    .then(jobs.getAll)
    .then(data => jobs.get(data, req.params.jobSlug))
    .then(data => {
      data.notification = {
        message: `${data.savedJob.title} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({data, req, res, next, companySlug}))
}

function addPersonThenReferralHandler (req, res, next) {
  const email = req.body.email
  const companySlug = req.params.companySlug

  jobs.get(merge(req.session.data), req.params.jobSlug)
    .then(data => people.post(data, {email}))
    .then(data => jobs.addReferral(data, data.job.id, data.newPerson.id))
    .then(data => {
      data.notification = {
        message: `${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({data, req, res, next, companySlug}))
}

function addReferralHandler (req, res, next) {
  const person = req.params.personId
  const companySlug = req.params.companySlug

  jobs.get(merge(req.session.data), req.params.jobSlug)
    .then(data => jobs.addReferral(data, data.job.id, person))
    .then(data => {
      data.notification = {
        message: `${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({data, req, res, next, companySlug}))
}

function smooshJob (data, job) {
  const relatedCompany = data.companies.find(company => company.id === job.company)
  const relatedHirers = data.hirers.filter(hirer => hirer.company === job.company)
  const hirers = relatedHirers.map(hirer => {
    const person = data.people.find(person => person.id === hirer.person)
    return merge({}, hirer, { person })
  })
  const company = merge({}, relatedCompany, { hirers })
  return merge({}, job, { company })
}

function smooshJobs (data) {
  data.expandedJobs = data.jobs.map(job => smooshJob(data, job))
  return promiseMap(data)
}

function genericPersonHandler (req, res, next, data, person) {
  people.getAll(data)
    .then(data => people.get(data, person))
    // Referrals associated with this person
    .then(data => jobs.getAll(data))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(data => hirers.getAll(data))
    .then(data => promiseMap(data)) // Do I need this?
    .then(data => smooshJobs(data))
    .then(data => jobs.getReferralsForPerson(data, person))
    // Recommendations associated with this person
    .then(data => network.getByPerson(data, person))
    // This person's hirer and company information
    .then(data => hirers.getFirstByPerson(data, data.person.id))
    .then(data => data.hirer ? addDataKeyValue('company', data => companies.get(data.hirer.company))(data) : data)
    .then(data => data.hirer ? tasks.getAllByHirerAndCompany(data, data.hirer.id, data.hirer.company) : data)
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

router.get('/', respondWithData(fetchersCompanies.get))
router.post('/', respondWithData(fetchersCompanies.post))

router.get('/people', respondWithData(fetchersPeople.get))
router.post('/people', respondWithData(fetchersPeople.post))
router.get('/people/:personId', respondWithData(fetchersPerson.get))
router.put('/people/:personId', respondWithData(fetchersPerson.put))
router.post('/people/:personId/referrals/:jobSlug', respondWithData(fetchersPerson.postReferral))
router.post('/people/:personId/recommendations/:jobSlug', respondWithData(fetchersPerson.postRecommendation))
router.post('/people/:personId/tasks/:taskType', respondWithData(fetchersPerson.postTask))

router.get('/:companySlug', companyHandler)
router.put('/:companySlug', editCompanyHandler)
router.post('/:companySlug/jobs', addCompanyJobHandler)
router.get('/:companySlug/jobs/:jobSlug', jobHandler)
router.put('/:companySlug/jobs/:jobSlug', editJobHandler)
router.post('/:companySlug/jobs/:jobSlug/referrals', addPersonThenReferralHandler)
router.post('/:companySlug/jobs/:jobSlug/referrals/:personId', addReferralHandler)
router.post('/:companySlug/hirers', addPersonThenCompanyHirerHandler)
router.post('/:companySlug/hirers/:person', addCompanyHirerHandler)
router.get('/:companySlug/messages/:surveyMessageId', surveyMessageHandler)
router.post('/:companySlug/surveys', addCompanySurveyLinkHandler)
router.patch('/:companySlug/surveys/:surveyId', updateCompanySurveyLinkHandler)
router.post('/:companySlug/tasks/:taskType', addCompanyTaskHandler)

router.get('*', (req, res) => {
  let data = getRenderDataBuilder(req)({})
  getRenderer(req, res)(data)
})

module.exports = router
