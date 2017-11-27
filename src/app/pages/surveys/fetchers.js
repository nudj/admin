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
  const gql = `
    query NewSurvey ($filters: SurveyFilterInput) {
      newSurvey: surveys (filters: $filters) {
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

function postSurvey ({ data, body }) {
  // TBA
}

module.exports = {
  get,
  getNew,
  postSurvey
}
