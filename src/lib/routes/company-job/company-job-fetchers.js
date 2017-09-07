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
  put
}
