function get ({ query }) {
  const gql = `
    query SurveyPage ($filters: SurveyFilterInput) {
      surveys (filters: $filters) {
        id
        title: introTitle
        description: introDescription
        company {
          name
        }
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
