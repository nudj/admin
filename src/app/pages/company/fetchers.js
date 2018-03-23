const omit = require('lodash/omit')

const { Redirect } = require('@nudj/framework/errors')

const {
  merge,
  actionMapAssign
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const tasks = require('../../server/modules/tasks')
const surveys = require('../../server/modules/surveys')
const hirers = require('../../server/modules/hirers')
const accessToken = process.env.PRISMICIO_ACCESS_TOKEN
const repo = process.env.PRISMICIO_REPO
const prismic = require('../../server/modules/prismic')({accessToken, repo})

const addPeopleToHirers = (hirers, people) => hirers.map(hirer => {
  const person = people.find(person => person.id === hirer.person)
  return merge(hirer, { person })
})

const addPageData = (companySlug) => [
  {
    company: data => data.company || companies.get(companySlug),
    companies: data => companies.getAll(),
    people: data => people.getAll(data).then(data => data.people),
    jobTemplateTags: data => prismic.fetchAllJobTags()
  },
  {
    jobs: data => jobs.getAll({}, data.company.id).then(data => data.jobs),
    hirers: data => hirers.getAllByCompany(data, data.company.id).then(data => addPeopleToHirers(data.hirers, data.people))
  }
]

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
      setNotification(type: "success", message: "${body.title} created") {
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

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug),
      newPerson: () => people.post({}, { email }).then(data => data.newPerson)
    },
    {
      newHirer: data => hirers.post({}, {
        company: data.company.id,
        person: data.newPerson.id
      }).then(data => data.newHirer)
    },
    {
      notification: data => ({
        message: `New person and hirer added`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function postHirerPerson ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const person = params.person

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug)
    },
    {
      newHirer: data => hirers.post({}, {
        company: data.company.id,
        person
      }).then(data => data.newHirer)
    },
    {
      notification: data => ({
        message: `New hirer added`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

module.exports = {
  get,
  put,
  postJob,
  postHirer,
  postHirerPerson
}
