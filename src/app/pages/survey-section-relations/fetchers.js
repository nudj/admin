const { Redirect } = require('@nudj/framework/errors')

function get ({ params }) {
  const gql = `
    query surveySectionRelationsPage ($id: ID) {
      section: surveySection (id: $id) {
        id
        title
        description
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
      $input: SurveySectionUpdateInput
    ) {
      section: updateSurveySection (
        id: $id
        input: $input
      ) {
        id
      }
    }
  `
  const variables = {
    id: params.sectionId,
    input: body
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/section/${data.section.id}/questions`,
      notification: { type: 'success', message: 'Questions reordered' }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  get,
  patch
}
