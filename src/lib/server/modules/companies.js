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

function editCompany (company) {
  return request(`companies/${company.id}`, {
    data: company,
    method: 'patch'
  })
}

function fetchCompany (companySlug) {
  return request(`companies/filter?slug=${companySlug}`)
    .then(results => results.pop())
}

function fetchCompanies () {
  return request(`companies`)
    .then(results => results.sort(common.sortByCreated))
}

module.exports.get = function (companySlug) {
  return fetchCompany(companySlug)
}

module.exports.getAll = function () {
  return fetchCompanies()
}

module.exports.post = function (data, company) {
  return createCompany(data, company)
}

module.exports.put = function (company) {
  return editCompany(company)
}
