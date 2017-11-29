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

function postSection ({ body }) {
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
      url: `/survey-section/${data.survey.id}`,
      notification: { type: 'success', message: 'Section created!' }
    })
  }

  return { gql, variables, respond }
}

function patchSection ({ body, params }) {
  const gql = `
    mutation UpdateSection (
      $id: ID!
      $input: SurveySectionUpdateInput
      ) {
      survey: updateSurveySection (
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
      url: `/survey-section/${data.survey.id}`,
      notification: { type: 'success', message: 'Survey updated' }
    })
  }

  return { gql, variables, respond }
}

function getOne ({ params }) {
  const gql = `
    query SectionPage ($id: ID) {
      section: surveySection (id: $id) {
        id
        description
        title
        survey {
          id
          title: introTitle
          company {
            id
            name
          }
        }
        questions: surveyQuestions {
          id
          title
          description
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
  postSection,
  patchSection
}
