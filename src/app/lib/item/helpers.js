const omit = require('lodash/omit')

function queryStringOmit (query, filter) {
  const newQuery = omit(query, [filter])
  const string = Object.keys(newQuery).map((value, key) => `${key}=${value}`).join('&')
  return string.length ? `?${string}` : ''
}

module.exports = {
  queryStringOmit
}
