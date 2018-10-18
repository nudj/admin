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
            id
            type: updateType(type: $type)
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
