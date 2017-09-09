const isAfter = require('date-fns/is_after')

const request = require('../../../framework/lib/request')

function fetchPersonFromFragment (fragment) {
  return request(`people/${fragment.personId || fragment}`)
}

module.exports.fetchPersonFromFragment = fetchPersonFromFragment

module.exports.fetchPeopleFromFragments = function (fragments) {
  return Promise.all(fragments.map((fragment) => fetchPersonFromFragment(fragment)))
}

module.exports.sortByCreated = function (a, b) {
  return isAfter(a.created, b.created) ? 1 : -1
}

module.exports.sortByModified = function (a, b) {
  return isAfter(a.modified, b.modified) ? 1 : -1
}
