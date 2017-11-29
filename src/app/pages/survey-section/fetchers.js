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

function postSurvey ({ body }) {
  const gql = `
    mutation CreateSurveySection (
      $title: String!
      $description: String
      $survey: ID!
    ) {
      survey: createSurveySection (input: {
        title: $title
        description: $description
        survey: $survey
      }) {
        id
      }
    }
  `
  const variables = {
    title: body.title,
    description: body.description,
    survey: body.survey
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey-section/new`, // ${data.survey.id}
      notification: { type: 'success', message: 'Section created!' }
    })
  }

  return { gql, variables, respond }
}

module.exports = {
  getNew,
  postSurvey
}
