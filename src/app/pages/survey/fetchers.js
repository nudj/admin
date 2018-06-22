const { Redirect } = require('@nudj/framework/errors')

function getNew () {
  const gql = `
    query NewSurvey {
      companies {
        id
        name
      }
    }
  `
  return { gql }
}

function getOne ({ params }) {
  const gql = `
    query SurveyPage ($id: ID) {
      survey (id: $id) {
        id
        slug
        introTitle
        introDescription
        outroTitle
        outroDescription
        company {
          id
          name
        }
      }
    }
  `
  const variables = {
    id: params.id
  }
  return { gql, variables }
}

function postSurvey ({ data, body }) {
  const {
    introTitle,
    outroTitle,
    introDescription,
    outroDescription
  } = body
  const gql = `
    mutation CreateSurvey (
      $company: ID
      $data: SurveyCreateInput!
    ) {
      survey: createSurvey (
        company: $company
        data: $data
      ) {
        id
      }
    }
  `
  const variables = {
    company: body.company,
    data: {
      introTitle,
      outroTitle,
      introDescription,
      outroDescription
    }
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/surveys/${data.survey.id}/questions`,
      notification: { type: 'success', message: 'Survey created!' }
    })
  }

  return { gql, variables, respond }
}

function patchSurvey ({ data, body, params }) {
  const gql = `
    mutation UpdateSurvey (
      $id: ID!
      $data: SurveyUpdateInput!
    ) {
      survey: updateSurvey (
        id: $id
        data: $data
      ) {
        id
      }
    }
  `
  const variables = {
    id: params.id,
    data: body
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/surveys/${data.survey.id}`,
      notification: { type: 'success', message: 'Survey updated' }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  getNew,
  getOne,
  patchSurvey,
  postSurvey
}
