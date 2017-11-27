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

function getNew ({ query }) {
  const filter = query.company || {}
  const gql = `
    query NewSurvey ($filters: SurveyFilterInput) {
      survey: surveyByFilters (filters: $filters) {
        company {
          name
          id
        }
      }
      companies {
        name
        id
      }
    }
  `
  const variables = {
    filters: { company: filter }
  }
  return { gql, variables }
}

function postSurvey ({ data, body }) {
  // TBA
}

module.exports = {
  get,
  getNew,
  postSurvey
}
