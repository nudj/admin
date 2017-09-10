const {
  merge,
  actionMapAssign,
  promiseMap,
  addDataKeyValue
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
      survey: data => surveys.getSurveyForCompany({}, data.company.id).then(data => data.survey),
      jobs: data => jobs.getAll({}, data.company.id).then(data => data.jobs),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers),
      surveyMessages: data => messages.getAllFor({}, data.company.id).then(data => data.surveyMessages),
      tasks: data => tasks.getAllByCompany({}, data.company.id).then(data => data.tasks)
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
      jobs: data => jobs.getAll({}, data.company.id).then(data => data.jobs),
      notification: data => ({
        message: `${data.company.name} saved`,
        type: 'success'
      }),
      survey: data => surveys.getSurveyForCompany({}, data.company.id).then(data => data.survey),
      tasks: data => tasks.getAllByCompany({}, data.company.id).then(data => data.tasks),
      surveyMessages: data => messages.getAllFor({}, data.company.id).then(data => data.surveyMessages),
      hirers: data => hirerSmooshing(merge(data)).then(data => data.hirers)
    }
  )
}

function postJob ({
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

function postHirer ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const email = body.email

  return Promise.resolve(data)
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => people.post(data, {email}))
    .then(data => addCompanyHirer(data, data.company.id, data.newPerson.id))
}

function postHirerPerson ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug

  return Promise.resolve(data)
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => addCompanyHirer(data, data.company.id, params.person))
}

function postSurvey ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  return surveys.post(data, body)
    .then(data => {
      data.notification = {
        message: `Survey added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => jobs.getAll(data, data.company.id))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(hirerSmooshing)
    .then(data => messages.getAllFor(data, data.company.id))
}

function patchSurvey ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const surveyId = params.surveyId
  return surveys.patch(data, surveyId, body)
    .then(data => {
      data.notification = {
        message: `Survey updated`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => jobs.getAll(data, data.company.id))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(hirerSmooshing)
    .then(data => messages.getAllFor(data, data.company.id))
}

function postTask ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug

  return Promise.resolve(data)
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => {
      const company = data.company.id
      const type = params.taskType
      const task = {company, type}
      return tasks.post(data, task)
    })
    .then(data => {
      data.notification = {
        message: `New ${data.newTask.type} task saved`,
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

function addCompanyHirer (data, company, person) {
  return hirers.post(data, {company, person})
    .then(data => {
      data.notification = {
        message: `New hirer added`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(addDataKeyValue('companies', companies.getAll))
    .then(data => jobs.getAll(data, data.company.id))
    .then(hirerSmooshing)
    .then(data => tasks.getAllByCompany(data, data.company.id))
}

module.exports = {
  get,
  put,
  postJob,
  postHirer,
  postHirerPerson,
  postSurvey,
  patchSurvey,
  postTask
}
