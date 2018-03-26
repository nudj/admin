const isThisWeek = require('date-fns/is_this_week')
const differenceInCalendarWeeks = require('date-fns/difference_in_calendar_weeks')
const omit = require('lodash/omit')

const { actionMapAssign } = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const accessToken = process.env.PRISMICIO_ACCESS_TOKEN
const repo = process.env.PRISMICIO_REPO
const prismic = require('../../server/modules/prismic')({accessToken, repo})

const formatActivityStatistics = (data) => {
  const today = new Date()

  const activity = {
    lastWeek: 0,
    thisWeek: 0,
    total: 0,
    trend: 0
  }

  activity.total = data.length
  activity.thisWeek = data.filter(entry => isThisWeek(entry.created)).length
  activity.lastWeek = data.filter(entry => differenceInCalendarWeeks(entry.created, today) === -1).length

  if (activity.thisWeek < activity.lastWeek) {
    activity.trend = -1
  } else if (activity.thisWeek > activity.lastWeek) {
    activity.trend = 1
  }

  return activity
}

const addActivities = ({ gql, variables }) => {
  return {
    gql,
    variables,
    transformData: (data) => {
      const { applications, referrals } = data.company.job
      const activities = {
        applications: formatActivityStatistics(applications),
        referrers: formatActivityStatistics(referrals)
      }

      return { ...data, activities }
    }
  }
}

const addPageData = (companySlug) => [
  {
    jobs: () => jobs.getAll({}).then(data => data.jobs),
    referrals: data => jobs.getReferrals({}, data.job.id).then(data => data.referrals),
    applications: data => jobs.getApplications({}, data.job.id).then(data => data.applications),
    company: data => data.company || companies.get(companySlug),
    people: data => people.getAll({}).then(data => data.people),
    activities: data => jobs.getJobActivities({}, data.job.id),
    jobTemplateTags: data => prismic.fetchAllJobTags()
  }
]

function get ({
  data,
  params
}) {
  const { companySlug, jobSlug } = params
  const gql = `
    query GetCompanyJob ($companySlug: String!, $jobSlug: String!) {
      company: companyByFilters(filters: { slug: $companySlug }) {
        id
        name
        slug
        job: jobByFilters(filters: { slug: $jobSlug }) {
          id
          created
          title
          type
          url
          slug
          status
          bonus
          candidateDescription
          roleDescription
          description
          experience
          labels
          location
          remuneration
          requirements
          roleDescription
          templateTags
          referrals {
            id
            created
            parent {
              id
            }
            person {
              id
              email
              firstName
              lastName
            }
          }
          applications {
            id
            created
            referral {
              id
            }
            person {
              id
              email
              firstName
              lastName
            }
          }
        }
      }
      jobs {
        id
        created
        bonus
        location
        slug
        status
        title
        company {
          id
        }
      }
      people {
        id
        email
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
    }
  `
  const variables = { companySlug, jobSlug }
  return addActivities({ gql, variables })
}

function put ({
  data,
  params,
  body
}) {
  const gql = `
    mutation GetCompanyJob (
      $companySlug: String!,
      $jobId: ID!,
      $jobData: JobUpdateInput!
    ) {
      company: companyByFilters(filters: { slug: $companySlug }) {
        id
        name
        slug
        job: updateJob(id: $jobId, data: $jobData) {
          id
          created
          title
          type
          url
          slug
          status
          bonus
          candidateDescription
          roleDescription
          description
          experience
          labels
          location
          remuneration
          requirements
          roleDescription
          templateTags
          referrals {
            id
            created
            parent {
              id
            }
            person {
              id
              email
              firstName
              lastName
            }
          }
          applications {
            id
            created
            referral {
              id
            }
            person {
              id
              email
              firstName
              lastName
            }
          }
        }
      }
      jobs {
        id
        created
        bonus
        location
        slug
        status
        title
        company {
          id
        }
      }
      people {
        id
        email
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
      notification: setNotification(type: "success", message: "${body.title} updated") {
        message
      }
    }
  `
  const variables = {
    companySlug: params.companySlug,
    jobId: body.id,
    jobData: omit(body, ['id'])
  }
  return addActivities({ gql, variables })
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
