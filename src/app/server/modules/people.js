const request = require('@nudj/framework/request')
const { NotFound } = require('@nudj/framework/errors')
const { promiseMap } = require('@nudj/library')
const omit = require('lodash/omit')

function fetchPeople () {
  return request(`people`)
}

function fetchPerson (personId) {
  return request(`people/${personId}`)
    .catch(error => {
      throw new NotFound('Person not found by id', personId, error)
    })
}

function fetchPersonByEmail (email) {
  const encodedEmail = encodeURIComponent(email)
  return request(`people/filter?email=${encodedEmail}`)
    .then(results => results.pop())
}

function savePerson (data) {
  const method = 'post'
  return request('people', { data, method })
}

function editPerson (person) {
  return request(`people/${person.id}`, {
    data: omit(person, ['id']),
    method: 'patch'
  })
}

module.exports.getAll = function (data) {
  data.people = fetchPeople()
  return promiseMap(data)
}

module.exports.get = function (data, person) {
  data.person = fetchPerson(person)
  return promiseMap(data)
}

module.exports.getByEmail = function (data, email) {
  data.person = fetchPersonByEmail(email)
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
