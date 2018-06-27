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
      companies: companiesByFilters(
        filters: {
          client: true
        }
      ) {
        id
        name
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
    mutation createPersonAndHirer (
      $person: PersonCreateInput!
      $hirer: HirerCreateInput
    ) {
      newPerson: createPersonAndHirer(
        person: $person
        hirer: $hirer
      ) {
        id
        firstName
        lastName
        email
      }
    }
  `
  const {
    person,
    hirer
  } = body
  const variables = {
    person,
    hirer
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
