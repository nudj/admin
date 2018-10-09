function getMany ({ query }) {
  const gql = `
    query (
      $filters: ReferralFilterInput!
      $filteredByJob: Boolean!
      $filteredJobId: ID
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
      allReferrals: referrals {
        id
      }
      job (id: $filteredJobId) @include(if: $filteredByJob) {
        id
        title
      }
    }
  `
  const variables = {
    filters: query,
    filteredByJob: !!query.job,
    filteredJobId: query.job
  }
  return {
    gql,
    variables
  }
}

module.exports = {
  getMany
}
