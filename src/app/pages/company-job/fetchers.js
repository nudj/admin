const { actionMapAssign } = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const accessToken = process.env.PRISMICIO_ACCESS_TOKEN
const repo = process.env.PRISMICIO_REPO
const prismic = require('../../server/modules/prismic')({accessToken, repo})

const addPageData = (companySlug) => [
  {
    jobs: () => jobs.getAll({}).then(data => data.jobs),
    referrals: data => jobs.getReferrals({}, data.job.id).then(data => data.referrals),
    applications: data => jobs.getApplications({}, data.job.id).then(data => data.applications),
    company: data => data.company || companies.get(companySlug),
    people: data => people.getAll({}).then(data => data.people),
    activities: data => jobs.getJobActivities({}, data.job.id)
  }
]

function get ({
  data,
  params
}) {
  const companySlug = params.companySlug

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug),
      jobTemplateTags: data => prismic.fetchAllJobTags()
    },
    {
      job: data => jobs.get(data, params.jobSlug, data.company.id).then(data => data.job)
    },
    ...addPageData(companySlug)
  )
}

function put ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug

  return actionMapAssign(
    data,
    {
      savedJob: () => jobs.put({}, body).then(data => data.savedJob)
    },
    {
      job: data => data.savedJob,
      notification: data => ({
        message: `${data.savedJob.title} saved`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function postReferral ({
  data,
  params,
  body
}) {
  const email = body.email
  const companySlug = params.companySlug

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug),
      newPerson: () => people.post({}, {email}).then(data => data.newPerson)
    },
    {
      job: data => jobs.get(data, params.jobSlug, data.company.id).then(data => data.job)
    },
    {
      referral: data => jobs.addReferral({}, data.job.id, data.newPerson.id).then(data => data.referral)
    },
    {
      notification: data => ({
        message: `New referral ${data.referral.id} saved`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function postReferralPerson ({
  data,
  params,
  body
}) {
  const person = params.personId
  const companySlug = params.companySlug

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug)
    },
    {
      job: data => jobs.get(data, params.jobSlug, data.company.id).then(data => data.job)
    },
    {
      referral: data => jobs.addReferral({}, data.job.id, person).then(data => data.referral)
    },
    {
      notification: data => ({
        message: `New referral ${data.referral.id} saved`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

module.exports = {
  get,
  put,
  postReferral,
  postReferralPerson
}
