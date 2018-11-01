function get ({ params }) {
  const gql = `
    query surveyRelatedQuestionsPage ($id: ID) {
      survey (id: $id) {
        id
        title: introTitle
        introDescription
        questions: surveyQuestions {
          id
          title
          type
          description
        }
      }
    }
  `
  const variables = {
    id: params.surveyId
  }
  return { gql, variables }
}

function patch ({ body, params }) {
  const gql = `
    mutation UpdateQuestionOrder (
      $id: ID!
      $data: SurveyUpdateInput!
    ) {
      survey: updateSurvey (
        id: $id
        data: $data
      ) {
        id
        title: introTitle
        introDescription
        questions: surveyQuestions {
          id
          title
          type
          description
        }
      }
      notification: setNotification (
        type: "success"
        message: "Survey questions reordered!"
      ) {
        type
        message
      }
    }
  `
  const variables = {
    id: params.surveyId,
    data: body
  }

  return { gql, variables }
}

module.exports = {
  get,
  patch
}
