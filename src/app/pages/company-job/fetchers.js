const isThisWeek = require('date-fns/is_this_week')
const differenceInCalendarWeeks = require('date-fns/difference_in_calendar_weeks')
const omit = require('lodash/omit')

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

const addActivities = data => {
  const { applications, referrals } = data.company.job
  const activities = {
    applications: formatActivityStatistics(applications),
    referrers: formatActivityStatistics(referrals)
  }

  return { ...data, activities }
}

function get ({ params }) {
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
          template
          tags
          referrals {
            id
            slug
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
              slug
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
        firstName
        lastName
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
    }
  `

  const variables = { companySlug, jobSlug }

  return {
    gql,
    variables,
    transformData: addActivities
  }
}

function put ({
  params,
  body,
  analytics
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
          modified
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
          tags
          referrals {
            id
            slug
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
              slug
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
        firstName
        lastName
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
      notification: setNotification(type: "success", message: "${body.title} updated") {
        type
        message
      }
    }
  `

  const variables = {
    companySlug: params.companySlug,
    jobId: body.id,
    jobData: omit(body, ['id'])
  }

  const transformData = response => {
    const data = addActivities(response)
    analytics.track({
      object: analytics.objects.job,
      action: analytics.actions.job.edited,
      properties: {
        jobTitle: data.company.job.title,
        jobCreated: data.company.job.created,
        jobModified: data.company.job.modified,
        jobSlug: data.company.job.slug,
        jobLocation: data.company.job.location,
        jobBonus: data.company.job.bonus,
        companyName: data.company.name
      }
    })

    return data
  }

  return {
    gql,
    variables,
    transformData
  }
}

function postReferral ({
  params,
  body,
  analytics
}) {
  const gql = `
    mutation GetCompanyJob (
      $companySlug: String!,
      $jobSlug: String!,
      $email: String!
    ) {
      company: companyByFilters(filters: { slug: $companySlug }) {
        id
        name
        slug
        job: jobByFilters(filters: { slug: $jobSlug }) {
          referral: createReferralByEmail(email: $email) {
            id
          }
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
          tags
          referrals {
            id
            slug
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
              slug
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
        firstName
        lastName
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
      notification: setNotification(type: "success", message: "New referral saved") {
        type
        message
      }
    }
  `

  const variables = {
    email: body.email,
    companySlug: params.companySlug,
    jobSlug: params.jobSlug
  }

  const transformData = response => {
    const data = addActivities(response)
    analytics.track({
      object: analytics.objects.job,
      action: analytics.actions.job.referred,
      properties: {
        method: 'manual',
        jobTitle: data.company.job.title,
        companyName: data.company.name,
        referralEmail: variables.email,
        referralId: data.company.job.referral.id
      }
    })

    return data
  }

  return {
    gql,
    variables,
    transformData
  }
}

module.exports = {
  get,
  put,
  postReferral
}
