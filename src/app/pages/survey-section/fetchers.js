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
        id
        name
      }
    }
  `

  return { gql }
}

function postSection ({ body }) {
  const gql = `
    mutation CreateSurveySection (
      $survey: ID!
      $data: SurveySectionCreateInput!
    ) {
      survey: createSurveySection (
        survey: $survey,
        data: $data
      ) {
        id
      }
    }
  `

  const variables = {
    survey: body.survey,
    data: {
      title: body.title,
      description: body.description
    }
  }

  const respond = (data) => {
    throw new Redirect({
      url: `/survey-sections/${data.survey.id}`,
      notification: { type: 'success', message: 'Section created!' }
    })
  }

  return { gql, variables, respond }
}

function patchSection ({ body, params }) {
  const gql = `
    mutation UpdateSection (
      $id: ID!
      $data: SurveySectionUpdateInput!
      ) {
      survey: updateSurveySection (
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
      url: `/survey-sections/${data.survey.id}`,
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
