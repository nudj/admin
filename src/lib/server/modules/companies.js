const request = require('../../lib/request')
const { promiseMap } = require('../lib')
const common = require('./common')

function createCompany (data, company) {
  data.newCompany = request(`companies`, {
    data: company,
    method: 'post'
  })

  return promiseMap(data)
}

function fetchCompany (data, companySlug) {
  data.company = request(`companies/${companySlug}`)
  return promiseMap(data)
}

function fetchCompanies (data) {
  data.companies = request(`companies/`)
    .then(results => results.sort(common.sortByCreated))
  return promiseMap(data)
}

module.exports.get = function (data, companySlug) {
  return fetchCompany(data, companySlug)
}

module.exports.getAll = function (data) {
  return fetchCompanies(data)
}

module.exports.post = function (data, company) {
  return createCompany(data, company)
}
