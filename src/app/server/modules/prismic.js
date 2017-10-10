const Prismic = require('prismic.io')
const union = require('lodash/union')

class PrismicModule {
  constructor ({accessToken, repo}) {
    this.accessToken = accessToken
    this.repo = repo
    this.repoUrl = `https://${this.repo}.prismic.io/api`
  }

  fetchContent (documentQuery = {}, returnOne = false) {
    const request = Prismic.api(this.repoUrl, {accessToken: this.accessToken})
      .then(api => this.queryDocuments({api, documentQuery}))
      .then(response => {
        if (!returnOne) {
          return response.results
        }
        return response.results.length ? response.results[0] : undefined
      })
      .catch(error => this.handleErrors(error))

    return request
  }

  handleErrors (error) {
    console.error('error', error)
    // DO ERROR HANDLING
    // throw new Error(error)
  }

  queryDocuments ({api, documentQuery}) {
    // An empty query SHOULD return all the documents // need to make sure this still happens // ?
    const prismicQuery = Object.keys(documentQuery).map(key => Prismic.Predicates.at(key, documentQuery[key]))
    // calling api.query('') will return all documents
    return api.query(prismicQuery)
  }

  fetchAllJobTags () {
    return Prismic.api(this.repoUrl, {accessToken: this.accessToken})
      .then(api => {
        return api.query()
      })
      .then(response => {
        const tags = response.results.map(document => document.tags)
        return union(...tags)
      })
      .catch(error => this.handleErrors(error))
  }
}

module.exports = (...args) => new PrismicModule(...args)
