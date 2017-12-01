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
      notification: setNotification (
        type: "success"
        message: "Section order updated!"
      ) {
        type
        message
      }
    }
  `
  const variables = {
    id: params.surveyId,
    input: body
  }

  return { gql, variables }
}

module.exports = {
  get,
  patch
}
