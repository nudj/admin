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

const post = ({ body, analytics }) => {
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

  const transformData = data => {
    analytics.track({
      object: analytics.objects.company,
      action: analytics.actions.company.created,
      properties: {
        companyName: data.newCompany.name
      }
    })

    return data
  }

  return { gql, variables, transformData }
}

module.exports = {
  get,
  post
}
