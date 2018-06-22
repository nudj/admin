const { Redirect } = require('@nudj/framework/errors')

function get () {
  const gql = `
    query CompaniesPage {
      companies {
        id
        slug
        name
      },
      clientCompanies: companiesByFilters (
        filters: {
          client: true
        }
      ) {
        id
        created
        slug
        name
        location
      }
    }
  `
  return { gql }
}

function post ({ data, body }) {
  const gql = `
    mutation CreateCompany (
      $data: CompanyCreateInput!
    ) {
      newCompany: createCompany (
        company: $data
      ) {
        id
        created
        slug
        name
        location
      }
    }
  `
  const variables = {
    data: {
      ...body
    }
  }

  const respond = (data) => {
    throw new Redirect({
      url: '/',
      notification: { type: 'success', message: `${data.newCompany.name} added` }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  get,
  post
}
