const request = require('@nudj/framework/request')
const { LogThenNotFound } = require('@nudj/framework/errors')
const common = require('./common')

module.exports.get = function (companySlug) {
  return request(`companies/filter?slug=${companySlug}`)
    .then(results => results.pop())
    .then(company => {
      if (!company) throw new LogThenNotFound('Company not found by slug', companySlug)
      return company
    })
}

module.exports.getById = function (companyId) {
  return request(`companies/${companyId}`)
    .catch(error => {
      throw new LogThenNotFound('Company not found by id', companyId, error)
    })
}

module.exports.getAll = function () {
  return request('companies')
    .then(results => results.sort(common.sortByCreated))
}

module.exports.getAllClients = function () {
  return request('companies/filter?client=true')
    .then(results => results.sort(common.sortByCreated))
}

module.exports.post = function (company) {
  return request('companies', {
    data: Object.assign({ client: true }, company),
    method: 'post'
  })
}

module.exports.put = function (company) {
  return request(`companies/${company.id}`, {
    data: company,
    method: 'patch'
  })
}
