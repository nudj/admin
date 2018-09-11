const omit = require('lodash/omit')
const { Redirect } = require('@nudj/framework/errors')

const get = ({ params }) => {
  const gql = `
    query GetCompanyPage ($slug: String!) {
      company: companyByFilters(filters: { slug: $slug }) {
        id
        name
        slug
        logo
        mission
        description
        industry
        location
        url
        facebook
        twitter
        linkedin
        onboarded
        hash
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
        hirers {
          id
          person {
            id
            firstName
            lastName
            email
          }
        }
      }
      companies {
        name
        slug
      }
      people {
        email
        id
        firstName
        lastName
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
    }
  `
  const variables = {
    slug: params.companySlug
  }
  const transformData = data => ({
    ...data,
    company: {
      ...data.company,
      invitationLink: `${process.env.PROTOCOL}://${process.env.HIRE_HOSTNAME}/invitation-accept/${data.company.hash}`
    }
  })

  return { gql, variables, transformData }
}

function put ({
  params,
  body
}) {
  const { id } = body
  const companyData = omit(body, ['id'])
  const gql = `
    mutation UpdateCompany ($id: ID!, $companyData: CompanyUpdateInput!) {
      company: updateCompany(id: $id, companyUpdate: $companyData) {
        slug
      }
    }
  `
  const variables = { id, companyData }
  const respond = ({ company }) => {
    throw new Redirect({
      url: `/companies/${company.slug}`,
      notification: { type: 'success', message: 'Company updated!' }
    })
  }

  return { gql, variables, respond }
}

function postJob ({
  params,
  body,
  analytics
}) {
  const gql = `
    mutation CreateCompanyJob ($slug: String!, $jobData: JobCreateInput!) {
      company: companyByFilters(filters: { slug: $slug }) {
        id
        name
        slug
        logo
        mission
        description
        industry
        location
        url
        facebook
        twitter
        linkedin
        onboarded
        newJob: createJob(data: $jobData) {
          id
          title
          created
          modified
          slug
          status
          bonus
          location
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
        hirers {
          id
          person {
            id
            firstName
            lastName
            email
          }
        }
      }
      companies {
        name
        slug
      }
      people {
        email
        id
        firstName
        lastName
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
      notification: setNotification(type: "success", message: "${body.title} created") {
        type
        message
      }
    }
  `
  const variables = {
    jobData: body,
    slug: params.companySlug
  }

  const respond = (data) => {
    analytics.track({
      object: analytics.objects.job,
      action: analytics.actions.job.created,
      properties: {
        jobTitle: data.company.newJob.title,
        jobCreated: data.company.newJob.created,
        jobModified: data.company.newJob.modified,
        jobSlug: data.company.newJob.slug,
        jobLocation: data.company.newJob.location,
        jobBonus: data.company.newJob.bonus,
        jobStatus: data.company.newJob.status,
        companyName: data.company.name
      }
    })

    throw new Redirect({
      url: `/companies/${data.company.slug}/jobs/${data.company.newJob.slug}`,
      notification: { type: 'success', message: 'Job created!' }
    })
  }

  return { gql, variables, respond }
}

function postHirer ({
  data,
  params,
  body
}) {
  const gql = `
    mutation GetCompanyPage ($slug: String!, $hirerData: HirerCreateByEmailInput!) {
      company: companyByFilters(filters: { slug: $slug }) {
        newHirer: createHirerByEmail(hirer: $hirerData) {
          id
        }
        id
        name
        slug
        logo
        mission
        description
        industry
        location
        url
        facebook
        twitter
        linkedin
        onboarded
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
        hirers {
          id
          person {
            id
            firstName
            lastName
            email
          }
        }
      }
      companies {
        name
        slug
      }
      people {
        email
        id
        firstName
        lastName
      }
      jobTemplateTags: fetchTags(repo: "web", type: "jobdescription")
      notification: setNotification(type: "success", message: "New hirer created") {
        type
        message
      }
    }
  `
  const variables = {
    slug: params.companySlug,
    hirerData: body
  }

  return { gql, variables }
}

module.exports = {
  get,
  put,
  postJob,
  postHirer
}
