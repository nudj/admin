const isThisWeek = require('date-fns/is_this_week')
const differenceInCalendarWeeks = require('date-fns/difference_in_calendar_weeks')

const { merge } = require('../../lib')
let request = require('../../lib/request')
let { promiseMap } = require('../lib')
const common = require('./common')

function createJob (data, job) {
  data.newJob = request(`jobs`, {
    data: job,
    method: 'post'
  })

  return promiseMap(data)
}

function fetchJob (data, jobSlug) {
  data.job = request(`jobs/${jobSlug}`)
  return promiseMap(data)
}

function fetchJobAndRecipients (data, jobSlug, recipients) {
  data.job = request(`jobs/${jobSlug}`)
  data.recipients = common.fetchPeopleFromFragments(recipients)
  return promiseMap(data)
}

function fetchJobApplications (data, jobId) {
  data.applications = request(`applications/filter?jobId=${jobId}`)
  return promiseMap(data)
}

function fetchJobReferrals (data, jobId) {
  data.referrals = request(`referrals/filter?jobId=${jobId}`)
  return promiseMap(data)
}

function saveJobReferral (jobId, personId) {
  const data = {jobId, personId}
  const method = 'post'
  return request('referrals', { data, method })
}

// function fetchAllJobs (data, key = 'jobs') {
//   data[key] = request(`jobs`)
//     .then(results => results.sort(common.sortByCreated))
//   return promiseMap(data)
// }

function fetchJobs (data, companyId, key = 'jobs') {
  let url = 'jobs'

  if (companyId) {
    url = `${url}/filter?companyId=${data.company.id}`
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
      data: patch
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

  dataCall.then(dataActivity => {
    const data = dataActivity[dataActivityKey]

    activity.total = data.length
    activity.thisWeek = data.filter(entry => isThisWeek(entry.created)).length
    activity.lastWeek = data.filter(entry => differenceInCalendarWeeks(entry.created, today) === -1).length

    if (activity.thisWeek < activity.lastWeek) {
      activity.trend = -1
    } else if (activity.thisWeek > activity.lastWeek) {
      activity.trend = 1
    }
  })

  return activity
}

function getJobActivities (data, jobId) {
  const applications = getJobActivity(fetchJobApplications({}, data.job.id), 'applications')
  const referrers = getJobActivity(fetchJobReferrals({}, data.job.id), 'referrals')

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

module.exports.get = function (data, jobSlug) {
  return fetchJob(data, jobSlug)
}

module.exports.getAll = function (data, companyId) {
  return fetchJobs(data, companyId)
}

module.exports.patch = function (data, jobSlug, patch) {
  return fetchJob(data, jobSlug)
  .then(patchJobWith(patch))
}

module.exports.compose = function (data, jobSlug, recipients) {
  return fetchJobAndRecipients(data, jobSlug, recipients)
}

module.exports.getApplications = function (data, jobId) {
  data.applications = request(`applications/filter?jobId=${jobId}`)
    .then(applications => Promise.all(applications.map(application => {
      return common.fetchPersonFromFragment(application.personId)
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

module.exports.getReferrals = function (data, jobId) {
  data.referrals = request(`referrals/filter?jobId=${jobId}`)
    .then(referrals => Promise.all(referrals.map(referral => {
      return common.fetchPersonFromFragment(referral.personId)
        .then(person => {
          const personDetails = {
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email
          }
          return merge(referral, personDetails)
        })
    })))

  return promiseMap(data)
}

module.exports.getJobActivities = function (data, jobId) {
  return getJobActivities(data, jobId)
}

module.exports.addReferral = function (data, jobId, personId) {
  data.referral = saveJobReferral(jobId, personId)
  return promiseMap(data)
}

module.exports.post = function (data, job) {
  return createJob(data, job)
}
