function get ({ query }) {
  const gql = `
    query surveyPage {
      surveys {
        id
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
    filters: query
  }
  return { gql, variables }
}

function getNew ({ query }) {
  const filter = query.company || {}
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
  const variables = {
    filters: { company: filter }
  }
  return { gql, variables }
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
    slug: body.slug,
    introDescription: body.introDescription,
    outroDescription: body.outroDescription
  }

  return { gql, variables }
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
        slug
        company {
          id
          name
        }
        sections: surveySections {
          id
          title
          description
        }
        introTitle
        introDescription
        outroTitle
        outroDescription
      }
    }
  `
  const variables = {
    id: params.id,
    input: body
  }

  return { gql, variables }
}

module.exports = {
  get,
  getNew,
  getOne,
  patchSurvey,
  postSurvey
}
