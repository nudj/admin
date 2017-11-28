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

module.exports = {
  get
}
