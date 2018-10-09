const isThisWeek = require('date-fns/is_this_week')
const differenceInCalendarWeeks = require('date-fns/difference_in_calendar_weeks')
const omit = require('lodash/omit')

function getMany ({ query }) {
  const gql = `
    query (
      $filters: JobFilterInput!
    ) {
      jobs: jobsByFilters (
        filters: $filters
      ) {
        id
        slug
        created
        title
        bonus
        location
        status
        company {
          id
          slug
          name
        }
      }
      allJobs: jobs {
        id
      }
    }
  `
  const variables = {
    filters: query
  }
  return {
    gql,
    variables
  }
}

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
  const { applications, referrals } = data.job
  const activities = {
    applications: formatActivityStatistics(applications),
    referrers: formatActivityStatistics(referrals)
  }

  return { ...data, activities }
}

function getOne ({ params }) {
  const { id } = params
  const gql = `
    query Job (
      $id: ID!
    ) {
      job (
        id: $id
      ) {
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
        company {
          id
          name
          slug
        }
        referrals {
          id
        }
        intros {
          id
        }
        applications {
          id
        }
      }
    }
  `

  const variables = { id }

  return {
    gql,
    variables,
    transformData: addActivities
  }
}

function putEdit ({
  params,
  body,
  analytics
}) {
  const gql = `
    mutation GetCompanyJob (
      $companySlug: String!,
      $id: ID!,
      $jobData: JobUpdateInput!
    ) {
      company: companyByFilters(filters: { slug: $companySlug }) {
        id
        name
        slug
        job: updateJob(id: $id, data: $jobData) {
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
    id: body.id,
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

module.exports = {
  getMany,
  getOne,
  putEdit
}
