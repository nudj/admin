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
      companies: companiesByFilters(
        filters: {
          client: true
        }
      ) {
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
      # person's referrals - needs to be moved under query.person.referrals (currently no resolver for this though)
      referrals: referralsByFilters(filters: {
        person: $personId
      }) {
        id
        created
        parent {
          id
          person {
            firstName
            lastName
          }
        }
        job {
          id
          title
          slug
          company {
            name
            slug
          }
        }
      }
      jobs {
        id
        slug
        title
        company {
          slug
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
      $personId: ID!
      $jobId: ID!
    ) {
      job (id: $jobId) {
        referral: getOrCreateReferralForUser (person: $personId) {
          id
        }
      }
    }
  `
  const variables = {
    personId: params.personId,
    jobId: params.jobId
  }

  const respond = data => {
    throw new Redirect({
      url: `/people/${params.personId}`,
      notification: {
        type: 'success',
        message: `New referral ${data.job.referral.id} saved`
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
