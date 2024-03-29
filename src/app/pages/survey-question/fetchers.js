const omit = require('lodash/omit')

const { Redirect } = require('@nudj/framework/errors')

function getNew ({ params }) {
  const gql = `
    query NewQuestion ($surveyId: ID!) {
      survey (id: $surveyId) {
        id
      }
    }
  `
  const variables = {
    surveyId: params.surveyId
  }

  return { gql, variables }
}

function postQuestion ({ body, params }) {
  const {
    title,
    description,
    type,
    tags,
    required = false
  } = body
  const gql = `
    mutation CreateSurveyQuestion (
      $survey: ID!,
      $data: SurveyQuestionCreateInput!
    ) {
      question: createSurveyQuestion (
        survey: $survey
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
        survey {
          id
          title: introTitle
        }
      }
    }
  `
  const variables = {
    survey: params.surveyId,
    data: {
      title,
      description,
      type,
      tags,
      required
    }
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/surveys/${data.question.survey.id}/questions`,
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
        survey {
          id
          title: introTitle
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
    data: omit(body, ['survey'])
  }

  return { gql, variables }
}

function getOne ({ params }) {
  const gql = `
    query SurveyQuestionPage ($id: ID) {
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
        survey {
          id
          title: introTitle
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
