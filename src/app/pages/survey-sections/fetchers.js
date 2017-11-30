function get ({ query }) {
  let gql = `
    query surveySectionsPage {
      sections: surveySections {
        id
        title
        description
        survey {
          id
          company {
            id
            name
          }
        }
      }
    }
  `
  let variables

  if (query.survey) {
    gql = `
      query surveySectionsPage ($surveyId: ID!) {
        survey (id: $surveyId) {
          id
          company {
            id
            name
          }
          sections: surveySections {
            id
            title
            description
          }
        }
      }
    `
    variables = {
      surveyId: query.survey
    }
  }

  return { gql, variables }
}

module.exports = {
  get
}
