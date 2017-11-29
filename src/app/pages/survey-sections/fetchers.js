function get () {
  const gql = `
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

  return { gql }
}

module.exports = {
  get
}
