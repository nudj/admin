const isThisWeek = require('date-fns/is_this_week')
const differenceInCalendarWeeks = require('date-fns/difference_in_calendar_weeks')
const {
  merge,
  promiseMap
} = require('@nudj/library')
const omit = require('lodash/omit')

const request = require('@nudj/framework/request')
const common = require('./common')

function createJob (data, job) {
  data.newJob = request(`jobs`, {
    data: job,
    method: 'post'
  })

  return promiseMap(data)
}

function editJob (data, job) {
  data.savedJob = request(`jobs/${job.id}`, {
    data: omit(job, ['id']),
    method: 'patch'
  })

  return promiseMap(data)
}

function fetchJob (data, jobSlug, companyId) {
  data.job = request(`jobs/filter?slug=${jobSlug}&company=${companyId}`)
    .then(results => results ? results.pop() : results)
  return promiseMap(data)
}

function fetchJobById (data, jobId) {
  data.job = request(`jobs/${jobId}`)
  return promiseMap(data)
}

function fetchJobAndRecipients (data, jobSlug, companyId, recipients) {
  data.job = request(`jobs/filter?slug=${jobSlug}&company=${companyId}`)
    .then(results => results ? results.pop() : results)
  data.recipients = common.fetchPeopleFromFragments(recipients)
  return promiseMap(data)
}

function fetchJobApplications (data, job) {
  data.applications = request(`applications/filter?job=${job}`)
  return promiseMap(data)
}

function fetchJobReferrals (data, job) {
  data.referrals = request(`referrals/filter?job=${job}`)
  return promiseMap(data)
}

function saveJobReferral (job, person) {
  const data = {job, person}
  const method = 'post'
  return request('referrals', { data, method })
}

function fetchJobs (data, company, key = 'jobs') {
  let url = 'jobs'

  if (company) {
    url = `${url}/filter?company=${company}`
  }

  data[key] = request(url)
    .then(results => results.sort(common.sortByCreated))
  return promiseMap(data)
}

function patchJobWith (patch) {
  return (data) => {
    data.job = request(`jobs/${data.job.id}`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json'
      },
      data: omit(patch, ['id'])
    })
    return promiseMap(data)
  }
}

function getJobActivity (dataCall, dataActivityKey) {
  const today = new Date()

  const activity = {
    lastWeek: 0,
    thisWeek: 0,
    total: 0,
    trend: 0
  }

  return dataCall.then(dataActivity => {
    const data = dataActivity[dataActivityKey]

    activity.total = data.length
    activity.thisWeek = data.filter(entry => isThisWeek(entry.created)).length
    activity.lastWeek = data.filter(entry => differenceInCalendarWeeks(entry.created, today) === -1).length

    if (activity.thisWeek < activity.lastWeek) {
      activity.trend = -1
    } else if (activity.thisWeek > activity.lastWeek) {
      activity.trend = 1
    }

    return activity
  })
}

function getJobActivities (jobId) {
  const applications = getJobActivity(fetchJobApplications({}, jobId), 'applications')
  const referrers = getJobActivity(fetchJobReferrals({}, jobId), 'referrals')

  // This is mocked for now
  const pageViews = {
    lastWeek: 0,
    thisWeek: 0,
    total: 0,
    trend: 0
  }

  const activities = { applications, referrers, pageViews }
  return promiseMap(activities)
}

module.exports.get = function (data, jobSlug, companyId) {
  return fetchJob(data, jobSlug, companyId)
}

module.exports.getById = function (data, jobId) {
  return fetchJobById(data, jobId)
}

module.exports.getAll = function (data, company) {
  return fetchJobs(data, company)
}

module.exports.patch = function (data, jobSlug, companyId, patch) {
  return fetchJob(data, jobSlug, companyId)
  .then(patchJobWith(patch))
}

module.exports.compose = function (data, jobSlug, companyId, recipients) {
  return fetchJobAndRecipients(data, jobSlug, companyId, recipients)
}

module.exports.getApplications = function (data, job) {
  data.applications = request(`applications/filter?job=${job}`)
    .then(applications => Promise.all(applications.map(application => {
      return common.fetchPersonFromFragment(application.person)
        .then(person => {
          const personDetails = {
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email
          }
          return merge(application, personDetails)
        })
    })))

  return promiseMap(data)
}

function transformReferralFragment (referral) {
  return common.fetchPersonFromFragment(referral.person)
    .then(person => {
      const personDetails = {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email
      }
      return merge(referral, personDetails)
    })
}

module.exports.getReferrals = function (data, job) {
  data.referrals = request(`referrals/filter?job=${job}`)
    .then(referrals => Promise.all(referrals.map(transformReferralFragment)))

  return promiseMap(data)
}

module.exports.getReferralsForPerson = function (data, person) {
  data.referrals = request(`referrals/filter?person=${person}`)
    .then(referrals => Promise.all(referrals.map(transformReferralFragment)))

  return promiseMap(data)
}

module.exports.getJobActivities = function (data, job) {
  return getJobActivities(job)
}

module.exports.addReferral = function (data, job, person) {
  data.referral = saveJobReferral(job, person)
  return promiseMap(data)
}

module.exports.post = function (data, job) {
  return createJob(data, job)
}

module.exports.put = function (data, job) {
  return editJob(data, job)
}