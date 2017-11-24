function get ({ query }) {
  const gql = `
    query SurveyPage ($filters: SurveyFilterInput) {
      surveys (filters: $filters) {
        id
      }
    }
  `
  const variables = {
    filters: query
  }
  return { gql, variables }
}

module.exports = {
  get
}
