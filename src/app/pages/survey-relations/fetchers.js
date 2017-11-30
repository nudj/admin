function get ({ params }) {
  const gql = `
    query surveyPage ($id: ID) {
      survey (id: $id) {
        id
        introTitle
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
    id: params.surveyId
  }
  return { gql, variables }
}

module.exports = {
  get
}
