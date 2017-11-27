function get ({ query }) {
  const gql = `
    query SurveyPage ($filters: SurveyFilterInput) {
      surveys (filters: $filters) {
        id
        title: introTitle
        description: introDescription
        company {
          name
        }
      }
    }
  `
  const variables = {
    filters: query
  }
  return { gql, variables }
}

function getNew ({ query }) {
  const filter = query.company || {}
  const gql = `
    query NewSurvey ($filters: SurveyFilterInput) {
      survey: surveyByFilters (filters: $filters) {
        company {
          name
          id
        }
      }
      companies {
        name
        id
      }
    }
  `
  const variables = {
    filters: { company: filter }
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
        slug
        company {
          id
          name
        }
        introTitle
        introDescription
        outroTitle
        outroDescription
      }
    }
  `
  const variables = {
    intro: body.intro,
    outro: body.outro,
    company: body.company,
    slug: 'slug',
    introDescription: body.introDescription,
    outroDescription: body.outroDescription
  }

  return { gql, variables }
}

module.exports = {
  get,
  getNew,
  postSurvey
}
