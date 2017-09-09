const request = require('../../../framework/lib/request')
const { promiseMap } = require('@nudj/library')

module.exports.post = function (data, survey) {
  data.survey = request(`surveys`, {
    method: 'post',
    data: survey
  })
  return promiseMap(data)
}

module.exports.patch = function (data, surveyId, survey) {
  data.survey = request(`surveys/${surveyId}`, {
    method: 'patch',
    data: survey
  })
  return promiseMap(data)
}

module.exports.getSurveyForCompany = function (data) {
  data.survey = request(`surveys/filter?company=${data.company.id}`)
    .then(results => results.pop())
  return promiseMap(data)
}
