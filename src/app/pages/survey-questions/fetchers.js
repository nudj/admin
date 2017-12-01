function get ({ query }) {
  let gql = `
    query surveySectionsPage {
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
      query surveyQuestionsPage ($sectionId: ID!) {
        section: surveySection (id: $sectionId) {
          id
          questions: surveySections {
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
      sectionId: query.survey
    }
  }

  return { gql, variables }
}

module.exports = {
  get
}
