const {
  addDataKeyValue,
  promiseMap
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')

function get ({
  data,
  params
}) {
  // Do we have an issue here with job-slug uniqueness across companies? YES!
  // TODO: check for job slug uniqueness across companies
  const companySlug = params.companySlug
  return jobs.get(data, params.jobSlug)
    .then(jobs.getAll)
    .then(data => genericGetJob({ data, companySlug }))
}

function put ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  return jobs.put(data, body)
    .then(jobs.getAll)
    .then(data => jobs.get(data, params.jobSlug))
    .then(data => {
      data.notification = {
        message: `${data.savedJob.title} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({ data, companySlug }))
}

function postReferral ({
  data,
  params,
  body
}) {
  const email = body.email
  const companySlug = params.companySlug

  return jobs.get(data, params.jobSlug)
    .then(data => people.post(data, {email}))
    .then(data => jobs.addReferral(data, data.job.id, data.newPerson.id))
    .then(data => {
      data.notification = {
        message: `New referral ${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({ data, companySlug }))
}

function postPersonReferral ({
  data,
  params,
  body
}) {
  const person = params.personId
  const companySlug = params.companySlug

  return jobs.get(data, params.jobSlug)
    .then(data => jobs.addReferral(data, data.job.id, person))
    .then(data => {
      data.notification = {
        message: `New referral ${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericGetJob({ data, companySlug }))
}

function genericGetJob ({ data, companySlug }) {
  return jobs.getReferrals(data, data.job.id)
    .then(data => jobs.getApplications(data, data.job.id))
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => people.getAll(data))
    .then(data => {
      data.activities = jobs.getJobActivities(data, data.job.id)
      return promiseMap(data)
    })
}

module.exports = {
  get,
  put,
  postReferral,
  postPersonReferral
}
