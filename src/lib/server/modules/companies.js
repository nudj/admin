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

function editCompany (data, company) {
  data.savedCompany = request(`companies/${company.id}`, {
    data: company,
    method: 'put'
  })

  return promiseMap(data)
}

function fetchCompany (data, companySlug) {
  data.company = request(`companies/filter?slug=${companySlug}`)
    .then(results => results.pop())
  return promiseMap(data)
}

function fetchCompanies (data) {
  data.companies = request(`companies`)
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

module.exports.put = function (data, company) {
  return editCompany(data, company)
}
