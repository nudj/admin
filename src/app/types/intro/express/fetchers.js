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

function getOne ({ params }) {
  const gql = `
    query (
      $id: ID
    ) {
      intro (
        id: $id
      ) {
        id
        created
        modified
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
    id: params.id
  }
  return {
    gql,
    variables
  }
}

module.exports = {
  getMany,
  getOne
}
