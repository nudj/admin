function getMany ({ query }) {
  const gql = `
    query (
      $filters: HirerFilterInput!
      $filteredByCompany: Boolean!
      $filteredCompanyId: ID
    ) {
      hirers: hirersByFilters (
        filters: $filters
      ) {
        id
        created
        modified
        type
        onboarded
        person {
          id
          firstName
          lastName
          email
        }
        company {
          id
          slug
          name
        }
      }
      allHirers: hirers {
        id
      }
      company (id: $filteredCompanyId) @include(if: $filteredByCompany) {
        id
        name
      }
    }
  `
  const variables = {
    filters: query,
    filteredByCompany: !!query.company,
    filteredCompanyId: query.company
  }
  return {
    gql,
    variables
  }
}

function getOne ({ params }) {
  const { id } = params
  const gql = `
    query Hirer (
      $id: ID!
    ) {
      hirer (
        id: $id
      ) {
        id
        created
        modified
        type
        onboarded
        person {
          id
          firstName
          lastName
          email
        }
        company {
          id
          name
          slug
        }
      }
    }
  `

  const variables = { id }

  return {
    gql,
    variables
  }
}

module.exports = {
  getMany,
  getOne
}
