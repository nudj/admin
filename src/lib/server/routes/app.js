const express = require('express')
const get = require('lodash/get')
const find = require('lodash/find')
const curry = require('lodash/curry')
const _ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const getTime = require('date-fns/get_time')
const {
  merge,
  promiseMap,
  addDataKeyValue
} = require('@nudj/library')

const logger = require('../lib/logger')
const companies = require('../modules/companies')
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
  req.session.data = {
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

const actionMap = (actionObj, data) => {
  let actionArr = []
  let keyMap = {}
  Object.keys(actionObj).forEach((key, i) => {
    keyMap[i] = key
    actionArr[i] = actionObj[key]
  })
  return Promise.all(actionArr.map(action => typeof action === 'function' ? action(data) : Promise.resolve(action))).then((resolvedArr) => {
    return resolvedArr.reduce((resolvedObj, v, i) => {
      resolvedObj[keyMap[i]] = v
      return resolvedObj
    }, {})
  })
}

const actionChain = curry((actions, data) => actions[0] ? actions[0](data).then(actionChain(actions.slice(1))) : data)

const actionAccumulator = (actionsObject, data) => {
  return actionMap(actionsObject, data).then(newData => Object.assign(data, newData))
}

function actionMapAssign (...actionsArray) {
  return actionChain(actionsArray.map(actionsObject => data => actionAccumulator(actionsObject, data)), {})
}

function respondWith (req, res, next) {
  return data => Promise.resolve(data)
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function companiesHandler (req, res, next) {
  actionMapAssign(
    merge(req.session.data),
    {
      companies: () => companies.getAll()
    }
  )
  .then(respondWith(req, res, next))
}

function addCompanyHandler (req, res, next) {
  const company = req.body

  actionMapAssign(
    merge(req.session.data),
    {
      newCompany: () => companies.post(company)
    },
    {
      companies: () => companies.getAll(),
      notification: data => ({
        message: `${data.newCompany.name} added`,
        type: 'success'
      })
    }
  )
  .then(respondWith(req, res, next))
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
      companies: () => companies.getAll()
    },
    {
      survey: data => surveys.getSurveyForCompany(merge(data)).then(data => data.survey),
      jobs: data => jobs.getAll(merge(data), data.company.id).then(data => data.jobs),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers),
      messages: data => messages.getAllFor(merge(data), data.company.id).then(data => data.messages),
      tasks: data => tasks.getAllByCompany(merge(data), data.company.id).then(data => data.tasks)
    }
  )
  .then(respondWith(req, res, next))
}

function addCompanyJobHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const job = req.body

  companies
    .get(merge(req.session.data), companySlug)
    .then(data => {
      job.company = data.company.id
      return jobs.post(data, job)
    })
    .then(data => {
      data.message = {
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
      data.message = {
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
  companies
    .get(merge(req.session.data), req.params.companySlug)
    .then(data => addCompanyHirer(req, res, next, data, data.company.id, req.params.person))
}

function addPersonThenCompanyHirerHandler (req, res, next) {
  const email = req.body.email

  companies
    .get(merge(req.session.data), req.params.companySlug)
    .then(data => people.post(data, {email}))
    .then(data => addCompanyHirer(req, res, next, data, data.company.id, data.newPerson.id))
}

function addCompanyTaskHandler (req, res, next) {
  companies
    .get(merge(req.session.data), req.params.companySlug)
    .then(data => {
      const company = data.company.id
      const type = req.params.taskType
      const task = {company, type}
      return tasks.post(data, task)
    })
    .then(data => {
      data.message = {
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
  jobs
    .get(merge(req.session.data), req.params.jobSlug)
    .then(jobs.getAll)
    .then(data => genericGetJob({data, req, res, next, companySlug}))
}

function editJobHandler (req, res, next) {
  const companySlug = req.params.companySlug
  jobs
    .put(merge(req.session.data), req.body)
    .then(jobs.getAll)
    .then(data => jobs.get(data, req.params.jobSlug))
    .then(data => {
      data.message = {
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

  jobs
    .get(merge(req.session.data), req.params.jobSlug)
    .then(data => people.post(data, {email}))
    .then(data => jobs.addReferral(data, data.job.id, data.newPerson.id))
    .then(data => {
      data.message = {
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

  jobs
    .get(merge(req.session.data), req.params.jobSlug)
    .then(data => jobs.addReferral(data, data.job.id, person))
    .then(data => {
      data.message = {
        message: `${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({data, req, res, next, companySlug}))
}

function peopleHandler (req, res, next) {
  people
    .getAll(merge(req.session.data))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function addPersonHandler (req, res, next) {
  people
    .post(merge(req.session.data), req.body)
    .then(data => {
      data.message = {
        message: `${data.newPerson.firstName} ${data.newPerson.lastName} added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => people.getAll(data))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
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
  people
    .getAll(data)
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
    .then(data => data.hirer ? addDataKeyValue('company', data => companies.get(data.hirer.company)) : data)
    .then(data => data.hirer ? tasks.getAllByHirerAndCompany(data, data.hirer.id, data.hirer.company) : data)
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function personHandler (req, res, next) {
  genericPersonHandler(req, res, next, merge(req.session.data), req.params.personId)
}

function surveyMessageHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const surveyMessageId = req.params.surveyMessageId

  companies
    .get(merge(req.session.data), companySlug)
    .then(data => messages.getOneById(data, surveyMessageId))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function editPersonHandler (req, res, next) {
  people
    .put(merge(req.session.data), req.body)
    .then(data => {
      data.message = {
        message: `${data.savedPerson.firstName} ${data.savedPerson.lastName} saved`,
        type: 'success'
      }
      data.person = data.savedPerson
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(req, res, next, merge(req.session.data), req.params.personId))
}

function addPersonReferralHandler (req, res, next) {
  jobs
    .get(merge(req.session.data), req.params.jobSlug)
    .then(data => jobs.addReferral(data, data.job.id, req.params.personId))
    .then(data => {
      data.message = {
        message: `${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(req, res, next, data, req.params.personId))
}

function addPersonRecommendationHandler (req, res, next) {
  const hirer = req.body.hirer
  jobs
    .get(merge(req.session.data), req.params.jobSlug)
    .then(data => network.post(data, hirer, data.job.id, req.params.personId))
    .then(data => {
      data.message = {
        message: `${data.recommendation.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(req, res, next, data, req.params.personId))
}

function addCompanySurveyLinkHandler (req, res, next) {
  const companySlug = req.params.companySlug
  surveys
    .post(merge(req.session.data), req.body)
    .then(data => {
      data.message = {
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
  surveys
    .patch(merge(req.session.data), surveyId, req.body)
    .then(data => {
      data.message = {
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

function addPersonTaskHandler (req, res, next) {
  people
    .get(merge(req.session.data), req.params.personId)
    .then(data => hirers.getFirstByPerson(data, data.person.id))
    .then(data => {
      const hirer = data.hirer.id
      const type = req.params.taskType
      const task = {hirer, type}
      return tasks.post(data, task)
    })
    .then(data => {
      data.message = {
        message: `New ${data.newTask.type} task saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(req, res, next, data, data.person.id))
}

router.use(ensureLoggedIn)

router.get('/', companiesHandler)
router.post('/', addCompanyHandler)

router.get('/people', peopleHandler)
router.post('/people', addPersonHandler)
router.get('/people/:personId', personHandler)
router.put('/people/:personId', editPersonHandler)
router.post('/people/:personId/referrals/:jobSlug', addPersonReferralHandler)
router.post('/people/:personId/recommendations/:jobSlug', addPersonRecommendationHandler)
router.post('/people/:personId/tasks/:taskType', addPersonTaskHandler)

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
