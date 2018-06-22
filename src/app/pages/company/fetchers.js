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
        description
        location
        url
        client
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
  return { gql, variables }
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
  body
}) {
  const gql = `
    mutation CreateCompanyJob ($slug: String!, $jobData: JobCreateInput!) {
      company: companyByFilters(filters: { slug: $slug }) {
        id
        name
        slug
        logo
        description
        location
        url
        client
        newJob: createJob(data: $jobData) {
          id
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
  return { gql, variables }
}

function postHirer ({
  data,
  params,
  body
}) {
  const gql = `
    mutation GetCompanyPage ($slug: String!, $hirerData: HirerCreateInput!) {
      company: companyByFilters(filters: { slug: $slug }) {
        newHirer: createHirerByEmail(hirer: $hirerData) {
          id
        }
        id
        name
        slug
        logo
        description
        location
        url
        client
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
