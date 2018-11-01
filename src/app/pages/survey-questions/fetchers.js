function get ({ query }) {
  let gql = `
    query surveyQuestionsPage {
      questions: surveyQuestions {
        id
        name
        title
        description
        type
      }
    }
  `
  let variables

  if (query.survey) {
    gql = `
      query surveyQuestionsPage ($surveyId: ID!) {
        survey (id: $surveyId) {
          id
          questions: surveyQuestions {
            id
            name
            title
            description
            type
          }
        }
      }
    `
    variables = {
      surveyId: query.survey
    }
  }

  return { gql, variables }
}

module.exports = {
  get
}
