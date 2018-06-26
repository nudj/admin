const omit = require('lodash/omit')
const { Redirect } = require('@nudj/framework/errors')

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
        referrals {
          id
          created
          slug
          job {
            id
            title
            slug
            company {
              name
              slug
            }
          }
          parent {
            id
            slug
            person {
              firstName
              lastName
            }
          }
        }
      }
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `
  const variables = {
    personId: params.personId
  }

  return { gql, variables }
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
  const gql = `
    mutation postReferral (
      $personId: ID!,
      $jobId: ID!
    ) {
      person (
        id: $personId
      ) {
        id
        firstName
        lastName
        referral: createReferral (
          job: $jobId
        ) {
          id
          job {
            title
          }
        }
      }
    }
  `
  const variables = {
    personId: params.personId,
    jobId: body.jobId
  }
  const respond = ({ person }) => {
    throw new Redirect({
      url: `/people/${person.id}`,
      notification: {
        type: 'success',
        message: `Referral created for ${person.firstName} ${person.lastName} on job ${person.referral.job.title}!`
      }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  get,
  put,
  postReferral
}
