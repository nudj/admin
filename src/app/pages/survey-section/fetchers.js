const { Redirect } = require('@nudj/framework/errors')

function getNew () {
  const gql = `
    query NewSurvey {
      surveys {
        id
        title: introTitle
        company {
          id
          name
        }
      }
      companies {
        name
        id
      }
    }
  `

  return { gql }
}

function postSurvey ({ data, body }) {
  const gql = `
    mutation CreateSurvey (
      $introTitle: String
      $outroTitle: String
      $introDescription: String
      $outroDescription: String
      $company: ID!
      $slug: String!
    ) {
      survey: createSurvey (input: {
        introTitle: $introTitle
        outroTitle: $outroTitle
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
    introTitle: body.introTitle,
    outroTitle: body.outroTitle,
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

module.exports = {
  getNew,
  postSurvey
}
