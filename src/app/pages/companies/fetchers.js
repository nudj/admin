const get = () => {
  const gql = `
    query getCompanies {
      clientCompanies: companiesByFilters(filters: { client: true }) {
        id
        created
        slug
        name
        industry
        location
      }
    }
  `
  return { gql }
}

const post = ({
  body
}) => {
  const gql = `
    mutation createCompany ($companyData: CompanyCreateInput!) {
      newCompany: createCompany(company: $companyData) {
        created
        slug
        name
        industry
        location
      }
      clientCompanies: companiesByFilters(filters: { client: true }) {
        created
        slug
        name
        industry
        location
      }
      notification: setNotification(
        type: "success",
        message: "${body.name} added"
      ) {
        type
        message
      }
    }
  `
  const variables = {
    companyData: {
      ...body,
      client: true
    }
  }

  return { gql, variables }
}

module.exports = {
  get,
  post
}
