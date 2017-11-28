function get () {
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
  return { gql, variables: {} }
}

module.exports = {
  get
}
