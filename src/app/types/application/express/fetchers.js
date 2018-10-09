function getMany ({ query }) {
  const gql = `
    query (
      $filters: ApplicationFilterInput!
      $filteredByJob: Boolean!
      $filteredJobId: ID
    ) {
      applications: applicationsByFilters (
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
        referral {
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
      allApplications: applications {
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
