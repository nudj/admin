const express = require('express')
const get = require('lodash/get')
const _ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
let getTime = require('date-fns/get_time')

const logger = require('../lib/logger')
const companies = require('../modules/companies')
const jobs = require('../modules/jobs')
const people = require('../modules/people')
const { promiseMap } = require('../lib')

const app = require('../../app/server')
const router = express.Router()

const clone = (obj) => Object.assign({}, obj)

function spoofLoggedIn (req, res, next) {
  req.session.data = {
    person: {
      id: '21',
      firstName: 'David',
      lastName: 'Platt'
    },
    company: {
      id: '1',
      name: 'Johns PLC',
      slug: 'johns-plc'
    }
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

function companiesHandler (req, res, next) {
  companies
    .getAll(clone(req.session.data))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function addCompanyHandler (req, res, next) {
  const company = req.body
  const data = clone(req.session.data)

  companies
    .post(data, company)
    .then(data => {
      data.message = {
        message: `${data.newCompany.name} added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(companies.getAll)
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function editCompanyHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const company = req.body
  const data = clone(req.session.data)

  companies
    .put(data, company)
    .then(data => {
      data.message = {
        message: `${data.savedCompany.name} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(companies.getAll)
    .then(data => jobs.getAll(data, data.company.id))
    // This isn't returning the company properly
    .then(data => companies.get(data, companySlug))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function companyJobsHandler (req, res, next) {
  const companySlug = req.params.companySlug

  companies
    .get(clone(req.session.data), companySlug)
    .then(companies.getAll)
    .then(data => jobs.getAll(data, data.company.id))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function addCompanyJobHandler (req, res, next) {
  const companySlug = req.params.companySlug
  const job = req.body

  companies
    .get(clone(req.session.data), companySlug)
    .then(data => {
      job.companyId = data.company.id
      return jobs.post(data, job)
    })
    .then(data => {
      data.message = {
        message: `${data.newJob.title} added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(companies.getAll)
    .then(data => jobs.getAll(data, data.company.id))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function genericGetJob ({data, req, res, next}) {
  jobs.getReferrals(data, data.job.id)
    .then(data => jobs.getApplications(data, data.job.id))
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
  // Do we have an issue here with job-slug uniqueness across companies?
  jobs
    .get(clone(req.session.data), req.params.jobSlug)
    .then(jobs.getAll)
    .then(data => genericGetJob({data, req, res, next}))
}

function editJobHandler (req, res, next) {
  jobs
    .put(clone(req.session.data), req.body)
    .then(jobs.getAll)
    .then(data => jobs.get(data, req.params.jobSlug))
    .then(data => {
      data.message = {
        message: `${data.savedJob.title} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({data, req, res, next}))
}

function addPersonThenReferralHandler (req, res, next) {
  const email = req.body.email

  jobs
    .get(clone(req.session.data), req.params.jobSlug)
    .then(data => people.post(data, {email}))
    .then(data => jobs.addReferral(data, data.job.id, data.newPerson.id))
    .then(data => genericGetJob({data, req, res, next}))
}

function addReferralHandler (req, res, next) {
  const personId = req.params.personId

  jobs
    .get(clone(req.session.data), req.params.jobSlug)
    .then(data => jobs.addReferral(data, data.job.id, personId))
    .then(data => genericGetJob({data, req, res, next}))
}

function peopleHandler (req, res, next) {
  people
    .getAll(clone(req.session.data))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function addPersonHandler (req, res, next) {
  people
    .post(clone(req.session.data), req.body)
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

function personHandler (req, res, next) {
  people
    .getAll(clone(req.session.data))
    .then(data => people.get(data, req.params.personId))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

function editPersonHandler (req, res, next) {
  people
    .put(clone(req.session.data), req.body)
    .then(data => {
      data.message = {
        message: `${data.savedPerson.firstName} ${data.savedPerson.lastName} saved`,
        type: 'success'
      }
      console.log(data.savedPerson)
      data.person = data.savedPerson
      return promiseMap(data)
    })
    .then(data => people.getAll(data))
    .then(getRenderDataBuilder(req, res, next))
    .then(getRenderer(req, res, next))
    .catch(getErrorHandler(req, res, next))
}

router.get('/', ensureLoggedIn, companiesHandler)
router.post('/', ensureLoggedIn, addCompanyHandler)
router.put('/:companySlug', ensureLoggedIn, editCompanyHandler)
router.get('/:companySlug/jobs', ensureLoggedIn, companyJobsHandler)
router.post('/:companySlug/jobs', ensureLoggedIn, addCompanyJobHandler)
router.get('/:companySlug/jobs/:jobSlug', ensureLoggedIn, jobHandler)
router.put('/:companySlug/jobs/:jobSlug', ensureLoggedIn, editJobHandler)
router.post('/:companySlug/jobs/:jobSlug/referrals', ensureLoggedIn, addPersonThenReferralHandler)
router.post('/:companySlug/jobs/:jobSlug/referrals/:personId', ensureLoggedIn, addReferralHandler)
router.get('/people', ensureLoggedIn, peopleHandler)
router.post('/people', ensureLoggedIn, addPersonHandler)
router.get('/people/:personId', ensureLoggedIn, personHandler)
router.put('/people/:personId', ensureLoggedIn, editPersonHandler)
router.get('*', (req, res) => {
  let data = getRenderDataBuilder(req)({})
  getRenderer(req, res)(data)
})

module.exports = router
