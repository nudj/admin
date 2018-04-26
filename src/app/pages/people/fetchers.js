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
  body
}) {
  const gql = `
    mutation createPerson ($input: PersonCreateInput!) {
      newPerson: createPerson(input: $input) {
        id
        firstName
        lastName
      }
    }
  `
  const variables = {
    input: body
  }
  const respond = ({ newPerson }) => {
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
