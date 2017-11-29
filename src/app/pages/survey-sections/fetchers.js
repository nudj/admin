function get () {
  const gql = `
    query surveySectionsPage {
      surveySections {
        id
        title
        description
        survey {
          id
        }
      }
    }
  `
  return { gql }
}

module.exports = {
  get
}
