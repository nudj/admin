const request = require('@nudj/framework/request')
const { promiseMap } = require('@nudj/library')
const flatten = require('lodash/flatten')

module.exports.getAllFor = function getAllFor (data, companyId) {
  data.surveyMessages = request(`hirers/filter?company=${companyId}`)
    .then(hirers => {
      return Promise
        .all(hirers.map((hirer) => request(`surveyMessages/filter?hirer=${hirer.id}`)))
        .then((messages) => flatten(messages))
    })
  return promiseMap(data)
}

module.exports.getOneById = function getOneById (data, surveyMessageId) {
  data.surveyMessage = request(`surveyMessages/${surveyMessageId}`)
  return promiseMap(data)
}
