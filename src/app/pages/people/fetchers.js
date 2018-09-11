const { Redirect } = require('@nudj/framework/errors')

function get ({ data }) {
  const gql = `
    query getPersonHirers {
      people: hirersAsPeople {
        id
        created
        email
        firstName
        lastName
      }
    }
  `
  return { gql }
}

function post ({
  data,
  body,
  analytics
}) {
  const gql = `
    mutation createPerson ($input: PersonCreateInput!) {
      newPerson: createPerson(input: $input) {
        id
        firstName
        lastName
        email
      }
    }
  `

  const variables = {
    input: body
  }

  const respond = ({ newPerson }) => {
    analytics.track({
      object: analytics.objects.user,
      action: analytics.actions.user.created,
      properties: {
        name: `${newPerson.firstName} ${newPerson.lastName}`,
        $email: newPerson.email
      }
    })

    throw new Redirect({
      url: '/people',
      notification: {
        type: 'success',
        message: `${newPerson.firstName} ${newPerson.lastName} added`
      }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  get,
  post
}
