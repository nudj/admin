const request = require('@nudj/framework/request')
const { promiseMap } = require('@nudj/library')

function fetchHirers () {
  return request(`hirers`)
    .then(results => results || [])
}

function fetchHirer (hirer) {
  return request(`hirers/filter?id=${hirer}`)
    .then(results => results.pop())
}

function fetchHirersByCompany (company) {
  return request(`hirers/filter?company=${company}`)
    .then(results => results || [])
}

// This should only ever return 1
function fetchHirerByCompanyAndPerson (company, person) {
  return request(`hirers/filter?company=${company}&person=${person}`)
    .then(results => results.pop())
}

function fetchHirersByPerson (person) {
  return request(`hirers/filter?person=${person}`)
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

module.exports.getAllByCompany = function (data, company) {
  data.hirers = fetchHirersByCompany(company)
  return promiseMap(data)
}

module.exports.getByCompanyAndPerson = function (data, company, person) {
  data.hirer = fetchHirerByCompanyAndPerson(company, person)
  return promiseMap(data)
}

module.exports.getAllByPerson = function (data, person) {
  data.hirers = fetchHirersByPerson(person)
  return promiseMap(data)
}

module.exports.getFirstByPerson = function (data, person) {
  data.hirer = fetchHirersByPerson(person)
    .then(results => results ? results.pop() : undefined)
  return promiseMap(data)
}

module.exports.get = function (data, hirer) {
  data.hirer = fetchHirer(hirer)
  return promiseMap(data)
}

module.exports.post = function (data, hirer) {
  data.newHirer = saveHirer(hirer)
  return promiseMap(data)
}
