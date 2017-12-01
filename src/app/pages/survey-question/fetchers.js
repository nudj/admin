const omit = require('lodash/omit')
const { Redirect } = require('@nudj/framework/errors')

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
      $title: String!
      $description: String
      $section: ID!
      $name: String!
      $type: SurveyQuestionType!
      $required: Boolean!
    ) {
      question: createSurveyQuestion (input: {
        title: $title
        description: $description
        surveySection: $section
        name: $name
        type: $type
        required: $required
      }) {
        id
      }
    }
  `

  const variables = {
    title: body.title,
    description: body.description,
    name: body.name,
    type: body.type,
    section: body.section,
    required: body.required || false
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey-question/${data.question.id}`,
      notification: { type: 'success', message: 'Question created!' }
    })
  }

  return { gql, variables, respond }
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
      }
    }
  `

  const variables = {
    id: params.id,
    input: omit(body, ['section'])
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey-question/${data.question.id}`,
      notification: { type: 'success', message: 'Question updated' }
    })
  }

  return { gql, variables, respond }
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
