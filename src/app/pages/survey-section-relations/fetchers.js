function get ({ params }) {
  const gql = `
    query surveySectionRelationsPage ($id: ID) {
      section: surveySection (id: $id) {
        id
        title
        description
        survey {
          id
        }
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
    id: params.sectionId
  }
  return { gql, variables }
}

function patch ({ body, params }) {
  const gql = `
    mutation UpdateQuestionOrder (
      $id: ID!
      $data: SurveySectionUpdateInput!
    ) {
      section: updateSurveySection (
        id: $id
        data: $data
      ) {
        id
        title
        description
        survey {
          id
        }
        questions: surveyQuestions {
          id
          title
          type
          description
        }
      }
      notification: setNotification (
        type: "success"
        message: "Section questions reordered!"
      ) {
        type
        message
      }
    }
  `
  const variables = {
    id: params.sectionId,
    data: body
  }

  return { gql, variables }
}

module.exports = {
  get,
  patch
}
