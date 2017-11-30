const { Redirect } = require('@nudj/framework/errors')

function get ({ params }) {
  const gql = `
    query surveyPage ($id: ID) {
      survey (id: $id) {
        id
        introTitle
        introDescription
        outroTitle
        outroDescription
        sections: surveySections {
          id
          title
          description
        }
        company {
          id
          name
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
    mutation UpdateSectionOrder (
      $id: ID!
      $input: SurveyUpdateInput
    ) {
      survey: updateSurvey (
        id: $id
        input: $input
      ) {
        id
      }
    }
  `
  const variables = {
    id: params.surveyId,
    input: body
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey/${data.survey.id}/sections`,
      notification: { type: 'success', message: 'Sections reordered' }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  get,
  patch
}
