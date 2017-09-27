const request = require('@nudj/framework/request')
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

module.exports.getSurveyForCompany = function (data, companyId, type = 'EMPLOYEE_SURVEY') {
  data.survey = request(`surveys/filter?type=${type}&company=${companyId}`)
    .then(results => results.pop())
  return promiseMap(data)
}
