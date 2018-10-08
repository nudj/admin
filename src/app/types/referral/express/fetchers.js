function getMany ({ query }) {
  const gql = `
    query (
      $filters: ReferralFilterInput!
    ) {
      referrals: referralsByFilters (
        filters: $filters
      ) {
        id
        created
        job {
          id
          slug
          title
          company {
            name
          }
        }
        parent {
          id
          person {
            email
            firstName
            lastName
          }
        }
        person {
          id
          email
          firstName
          lastName
        }
      }
    }
  `
  const variables = {
    filters: query
  }
  return {
    gql,
    variables
  }
}

module.exports = {
  getMany
}
