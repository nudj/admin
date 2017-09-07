const {
  merge,
  actionMapAssign,
  promiseMap
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const messages = require('../../server/modules/messages')
const tasks = require('../../server/modules/tasks')
const surveys = require('../../server/modules/surveys')
const hirers = require('../../server/modules/hirers')

function get ({
  data,
  params
}) {
  return actionMapAssign(
    data,
    {
      company: () => companies.get(params.companySlug),
      companies: () => companies.getAll(),
      people: data => people.getAll(data).then(data => data.people)
    },
    {
      survey: data => surveys.getSurveyForCompany(merge(data)).then(data => data.survey),
      jobs: data => jobs.getAll(merge(data), data.company.id).then(data => data.jobs),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers),
      surveyMessages: data => messages.getAllFor(merge(data), data.company.id).then(data => data.surveyMessages),
      tasks: data => tasks.getAllByCompany(merge(data), data.company.id).then(data => data.tasks)
    }
  )
}

function put ({
  data,
  params,
  body
}) {
  return actionMapAssign(
    data,
    {
      company: () => companies.put(body)
    },
    {
      companies: () => companies.getAll(),
      jobs: data => jobs.getAll(merge(data), data.company.id).then(data => data.jobs),
      notification: data => ({
        message: `${data.company.name} saved`,
        type: 'success'
      }),
      tasks: data => tasks.getAllByCompany(merge(data), data.company.id).then(data => data.tasks),
      surveyMessages: data => messages.getAllFor(merge(data), data.company.id).then(data => data.surveyMessages),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers)
    }
  )
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
  get,
  put
}