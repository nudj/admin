function get () {
  const gql = `
    query surveyPage {
      surveys {
        id
        slug
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
  return { gql }
}

module.exports = {
  get
}
