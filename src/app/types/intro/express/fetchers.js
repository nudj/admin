function getMany ({ query }) {
  const gql = `
    query (
      $filters: IntroFilterInput!
      $filteredByJob: Boolean!
      $filteredJobId: ID
    ) {
      intros: introsByFilters (
        filters: $filters
      ) {
        id
        created
        job {
          title
          company {
            name
          }
        }
        person {
          email
          firstName
          lastName
        }
        candidate {
          email
          firstName
          lastName
        }
        notes
      }
      allIntros: intros {
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
