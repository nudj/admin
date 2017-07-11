const request = require('../../lib/request')
const { promiseMap } = require('../lib')

function fetchPeople () {
  return request(`people`)
}

function savePerson (data) {
  const method = 'post'
  return request('people', { data, method })
}

module.exports.getAll = function (data) {
  data.people = fetchPeople()
  return promiseMap(data)
}

module.exports.post = function (data, person) {
  data.newPerson = savePerson(person)
  return promiseMap(data)
}
