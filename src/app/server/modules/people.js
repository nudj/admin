const request = require('@nudj/framework/request')
const { LogThenNotFound } = require('@nudj/framework/errors')
const { promiseMap } = require('@nudj/library')

function fetchPeople () {
  return request(`people`)
}

function fetchPerson (personId) {
  return request(`people/${personId}`)
    .catch(error => {
      throw new LogThenNotFound('Error fetching person', personId, error)
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

function editPerson (data) {
  const method = 'patch'
  return request(`people/${data.id}`, { data, method })
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
