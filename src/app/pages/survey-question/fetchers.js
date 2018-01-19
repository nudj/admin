const omit = require('lodash/omit')

function getNew () {
  const gql = `
    query NewQuestion {
      surveySections {
        id
        title
      }
      surveyQuestions {
        name
      }
    }
  `

  return { gql }
}

function postQuestion ({ body }) {
  const gql = `
    mutation CreateSurveyQuestion (
      $section: ID!,
      $data: SurveyQuestionCreateInput!
    ) {
      question: createSurveyQuestion (
        surveySection: $section
        data: $data
      ) {
        id
        description
        title
        name
        required
        type
        section: surveySection {
          id
          title
        }
      }
      notification: setNotification (
        type: "success"
        message: "Question created!"
      ) {
        type
        message
      }
    }
  `

  const variables = {
    section: body.section,
    data: {
      title: body.title,
      description: body.description,
      name: body.name,
      type: body.type,
      required: body.required || false
    }
  }

  return { gql, variables }
}

function patchQuestion ({ body, params }) {
  const gql = `
    mutation UpdateQuestion (
      $id: ID!
      $input: SurveyQuestionUpdateInput
      ) {
      question: updateSurveyQuestion (
        id: $id
        input: $input
      ) {
        id
        description
        title
        name
        required
        type
        section: surveySection {
          id
          title
        }
      }
      notification: setNotification (
        type: success
        message: "Question updated"
      ) {
        type
        message
      }
    }
  `

  const variables = {
    id: params.id,
    input: omit(body, ['section'])
  }

  return { gql, variables }
}

function getOne ({ params }) {
  const gql = `
    query SectionPage ($id: ID) {
      question: surveyQuestion (id: $id) {
        id
        description
        title
        name
        required
        type
        section: surveySection {
          id
          title
        }
      }
    }
  `

  const variables = {
    id: params.id
  }

  return { gql, variables }
}

module.exports = {
  getNew,
  getOne,
  postQuestion,
  patchQuestion
}
