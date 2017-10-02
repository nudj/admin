const request = require('@nudj/framework/request')
const { LogThenNotFound } = require('@nudj/framework/errors')
const common = require('./common')

module.exports.get = function (companySlug) {
  return request(`companies/filter?slug=${companySlug}`)
    .then(results => results.pop())
    .then(company => {
      if (!company) throw new LogThenNotFound('Company not found', companySlug)
      return company
    })
}

module.exports.getAll = function () {
  return request(`companies`)
    .then(results => results.sort(common.sortByCreated))
}

module.exports.post = function (company) {
  return request(`companies`, {
    data: company,
    method: 'post'
  })
}

module.exports.put = function (company) {
  return request(`companies/${company.id}`, {
    data: company,
    method: 'patch'
  })
}
