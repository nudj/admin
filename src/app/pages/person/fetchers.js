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
        role {
          name
        }
        company {
          name
        }
        hirer {
          id
          type
          onboarded
          company {
            id
            name
          }
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
      companies {
        id
        name
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
  const {
    person: personData,
    hirer: hirerData
  } = body
  const gql = `
    mutation updatePersonAndHirer (
      $personId: ID!
      $personData: PersonCreateInput!
      $hirerData: HirerCreateInput
    ) {
      person: updatePersonAndHirer (
        personId: $personId
        personData: $personData
        hirerData: $hirerData
      ) {
        id
        firstName
        lastName
        hirer {
          id
          onboarded
        }
      }
    }
  `

  const variables = {
    personId: params.personId,
    personData,
    hirerData
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
