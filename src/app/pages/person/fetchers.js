const omit = require('lodash/omit')

const { Redirect } = require('@nudj/framework/errors')
const {
  merge,
  addDataKeyValue,
  promiseMap
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const hirers = require('../../server/modules/hirers')
const network = require('../../server/modules/network')
const tasks = require('../../server/modules/tasks')

function get ({ params }) {
  const gql = `
    query getPersonPage ($personId: ID!) {
      person(id: $personId) {
        id
        firstName
        lastName
        email
        url
        hirer {
          id
          type
          onboarded
        }
        role {
          name
        }
        company {
          name
        }
      }
    }
  `
  const variables = {
    personId: params.personId
  }
  const transformData = async ({ person }) => {
    const referralData = await genericPersonHandler({}, params.personId)
    return {
      ...referralData,
      person
    }
  }

  return { gql, variables, transformData }
}

function put ({
  params,
  body
}) {
  let gql
  let variables = {
    personId: params.personId,
    personData: omit(body, ['id', 'hirer'])
  }

  if (body.hirer) {
    gql = `
      mutation updatePerson (
        $personId: ID!,
        $personData: PersonUpdateInput!,
        $type: HirerType!,
        $onboarded: Boolean!
      ) {
        person: updatePerson(id: $personId, data: $personData) {
          id
          firstName
          lastName
          hirer {
            updateType(type: $type) {
              id
            }
            setOnboarded(onboard: $onboarded)
          }
        }
      }
    `

    variables = {
      ...variables,
      ...body.hirer
    }
  } else {
    gql = `
      mutation updatePerson ($personId: ID!, $personData: PersonUpdateInput!) {
        person: updatePerson(id: $personId, data: $personData) {
          id
          firstName
          lastName
        }
      }
    `
  }

  const respond = ({ person }) => {
    throw new Redirect({
      url: `/people/${person.id}`,
      notification: {
        type: 'success',
        message: `${person.firstName} ${person.lastName} updated!`
      }
    })
  }

  return { gql, variables, respond }
}

function postReferral ({
  data,
  params,
  body
}) {
  return jobs.getById(data, params.jobId)
    .then(data => jobs.addReferral(data, data.job.id, params.personId))
    .then(data => {
      data.notification = {
        message: `New referral ${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(data, params.personId))
}

function genericPersonHandler (data, personId) {
  return people.getAll(data)
    .then(data => people.get(data, personId))
    // Referrals associated with this person
    .then(data => jobs.getAll(data))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(data => hirers.getAll(data))
    .then(data => promiseMap(data)) // Do I need this?
    .then(data => smooshJobs(data))
    .then(data => jobs.getReferralsForPerson(data, personId))
    // Recommendations associated with this person
    .then(data => network.getByPerson(data, personId))
    // This person's hirer and company information
    .then(data => hirers.getFirstByPerson(data, data.person.id))
    .then(data => data.hirer ? addDataKeyValue('company', data => companies.getById(data.hirer.company))(data) : data)
    .then(data => data.hirer ? tasks.getAllByHirerAndCompany(data, data.hirer.id, data.hirer.company) : data)
}

function smooshJob (data, job) {
  const relatedCompany = data.companies.find(company => company.id === job.company)
  const relatedHirers = data.hirers.filter(hirer => hirer.company === job.company)
  const hirers = relatedHirers.map(hirer => {
    const person = data.people.find(person => person.id === hirer.person)
    return merge({}, hirer, { person })
  })
  const company = merge({}, relatedCompany, { hirers })
  return merge({}, job, { company })
}

function smooshJobs (data) {
  data.expandedJobs = data.jobs.map(job => smooshJob(data, job))
  return promiseMap(data)
}

module.exports = {
  get,
  put,
  postReferral
}
