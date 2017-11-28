const { Redirect } = require('@nudj/framework/errors')

function getNew () {
  const gql = `
    query NewSurvey {
      surveys {
        slug
      }
      companies {
        name
        id
      }
    }
  `
  return { gql, variables: {} }
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
          name
          id
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
      $intro: String
      $outro: String
      $introDescription: String
      $outroDescription: String
      $company: ID!
      $slug: String!
    ) {
      survey: createSurvey (input: {
        introTitle: $intro
        outroTitle: $outro
        introDescription: $introDescription
        outroDescription: $outroDescription
        company: $company
        slug: $slug
      }) {
        id
      }
    }
  `
  const variables = {
    intro: body.introTitle,
    outro: body.outroTitle,
    company: body.company,
    slug: body.slug,
    introDescription: body.introDescription,
    outroDescription: body.outroDescription
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey/${data.survey.id}`,
      notification: { type: 'success', message: 'Survey created!' }
    })
  }

  return { gql, variables, respond }
}

function patchSurvey ({ data, body, params }) {
  const gql = `
    mutation UpdateSurvey (
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
    id: params.id,
    input: body
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey/${data.survey.id}`,
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
