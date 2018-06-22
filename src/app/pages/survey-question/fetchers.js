const omit = require('lodash/omit')

const { Redirect } = require('@nudj/framework/errors')

function getNew () {
  const gql = `
    query NewQuestion {
      surveySections {
        id
        title
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
        slug
        description
        title
        required
        type
        tags {
          id
          name
          type
        }
        section: surveySection {
          id
          title
        }
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
      tags: body.tags,
      required: body.required || false
    }
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey-questions/${data.question.id}`,
      notification: { type: 'success', message: 'Question created!' }
    })
  }

  return { gql, variables, respond }
}

function patchQuestion ({ body, params }) {
  const gql = `
    mutation UpdateQuestion (
      $id: ID!
      $data: SurveyQuestionUpdateInput!
      ) {
      question: updateSurveyQuestion (
        id: $id
        data: $data
      ) {
        id
        slug
        description
        title
        required
        type
        tags {
          id
          name
          type
        }
        section: surveySection {
          id
          title
        }
      }
      notification: setNotification (
        type: "success"
        message: "Question updated"
      ) {
        type
        message
      }
    }
  `

  const variables = {
    id: params.id,
    data: omit(body, ['section'])
  }

  return { gql, variables }
}

function getOne ({ params }) {
  const gql = `
    query QuestionPage ($id: ID) {
      question: surveyQuestion (id: $id) {
        id
        slug
        description
        title
        required
        type
        tags {
          id
          name
          type
        }
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
