const {
  merge,
  promiseMap,
  addDataKeyValue
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const tasks = require('../../server/modules/tasks')
const hirers = require('../../server/modules/hirers')

function post ({
  data,
  params,
  body
}) {
  return Promise.resolve(data)
    .then(addDataKeyValue('company', () => companies.get(params.companySlug)))
    .then(data => {
      body.company = data.company.id
      return jobs.post(data, body)
    })
    .then(data => {
      data.notification = {
        message: `${data.newJob.title} added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('companies', companies.getAll))
    .then(data => jobs.getAll(data, data.company.id))
    .then(hirerSmooshing)
    .then(data => tasks.getAllByCompany(data, data.company.id))
}

function hirerSmooshing (data) {
  return people.getAll(data)
    .then(data => hirers.getAllByCompany(data, data.company.id))
    .then(data => {
      const expandedHirers = data.hirers.map(hirer => {
        const person = data.people.find(person => person.id === hirer.person)
        return merge({}, hirer, {person})
      })
      data.hirers = expandedHirers
      return promiseMap(data)
    })
}

module.exports = {
  post
}
