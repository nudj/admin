const { Redirect } = require('@nudj/framework/errors')

function getNew () {
  const gql = `
    query NewSurvey {
      surveys {
        slug
      }
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
        introTitle
        slug
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
    id: params.id
  }
  return { gql, variables }
}

function postSurvey ({ data, body }) {
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
      slug: body.slug,
      introTitle: body.introTitle,
      outroTitle: body.outroTitle,
      introDescription: body.introDescription,
      outroDescription: body.outroDescription
    }
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/surveys/${data.survey.id}`,
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
