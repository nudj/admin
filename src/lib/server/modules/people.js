const request = require('../../lib/request')
const { promiseMap } = require('../lib')

function fetchPeople () {
  return request(`people`)
}

function fetchPerson (personId) {
  return request(`people/filter?id=${personId}`)
    .then(results => results.pop())
}

function savePerson (data) {
  const method = 'post'
  return request('people', { data, method })
}

function editPerson (data) {
  const method = 'put'
  return request(`people/${data.id}`, { data, method })
}

module.exports.getAll = function (data) {
  data.people = fetchPeople()
  return promiseMap(data)
}

module.exports.get = function (data, personId) {
  data.person = fetchPerson(personId)
  return promiseMap(data)
}

module.exports.post = function (data, person) {
  data.newPerson = savePerson(person)
  return promiseMap(data)
}

module.exports.put = function (data, person) {
  data.savedPerson = editPerson(person)
  return promiseMap(data)
}
