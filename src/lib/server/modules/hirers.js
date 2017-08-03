const request = require('../../lib/request')
const { promiseMap } = require('../lib')

function fetchHirers () {
  return request(`hirers`)
    .then(results => results || [])
}

function fetchHirer (hirerId) {
  return request(`hirers/filter?id=${hirerId}`)
    .then(results => results.pop())
}

function fetchHirersByCompany (companyId) {
  return request(`hirers/filter?companyId=${companyId}`)
    .then(results => results || [])
}

function fetchHirersByCompanyAndPerson (companyId, personId) {
  return request(`hirers/filter?companyId=${companyId}&personId=${personId}`)
    .then(results => results || [])
}

function fetchHirersByPerson (companyId) {
  return request(`hirers/filter?id=${companyId}`)
    .then(results => results || [])
}

function saveHirer (data) {
  const method = 'post'
  return request('hirers', { data, method })
}

module.exports.getAll = function (data) {
  data.hirers = fetchHirers()
  return promiseMap(data)
}

module.exports.getAllByCompany = function (data, companyId) {
  data.hirers = fetchHirersByCompany(companyId)
  return promiseMap(data)
}

module.exports.getAllByCompanyAndPerson = function (data, companyId, personId) {
  data.hirers = fetchHirersByCompanyAndPerson(companyId, personId)
  return promiseMap(data)
}

module.exports.getAllByPerson = function (data, personId) {
  data.hirers = fetchHirersByPerson(personId)
  return promiseMap(data)
}

module.exports.get = function (data, hirerId) {
  data.hirer = fetchHirer(hirerId)
  return promiseMap(data)
}

module.exports.post = function (data, hirer) {
  data.newHirer = saveHirer(hirer)
  return promiseMap(data)
}
