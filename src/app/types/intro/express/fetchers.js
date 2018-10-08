function getMany ({ query }) {
  const gql = `
    query (
      $filters: IntroFilterInput!
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
