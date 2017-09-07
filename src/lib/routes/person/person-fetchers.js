const {
  merge,
  actionMapAssign,
  addDataKeyValue,
  promiseMap
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const hirers = require('../../server/modules/hirers')
const network = require('../../server/modules/network')
const tasks = require('../../server/modules/tasks')

function get ({
  data,
  params
}) {
  return genericPersonHandler(data, params.personId)
}

function put ({
  data,
  params,
  body,
  req
}) {
  return people.put(data, body)
    .then(data => {
      data.notification = {
        message: `${data.savedPerson.firstName} ${data.savedPerson.lastName} saved`,
        type: 'success'
      }
      data.person = data.savedPerson
      // if the updated person is the logged in person, update the session object too
      if (data.person.id === req.session.data.person.id) {
        req.session.data.person = data.person
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(data, params.personId))
}

function postReferral ({
  data,
  params
}) {
  return jobs.get(data, params.jobSlug)
    .then(data => jobs.addReferral(data, data.job.id, params.personId))
    .then(data => {
      data.notification = {
        message: `New referral ${data.referral.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(data, params.personId))
}

function postTask ({
  data,
  params
}) {
  return people.get(data, params.personId)
    .then(data => hirers.getFirstByPerson(data, data.person.id))
    .then(data => {
      const hirer = data.hirer.id
      const type = params.taskType
      const task = {hirer, type}
      return tasks.post(data, task)
    })
    .then(data => {
      data.notification = {
        message: `New ${data.newTask.type} task saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(data, data.person.id))
}

function postRecommendation ({
  data,
  params,
  body
}) {
  return jobs.get(data, params.jobSlug)
    .then(data => network.post(data, body.hirer, data.job.id, params.personId))
    .then(data => {
      data.notification = {
        message: `New recommendation ${data.recommendation.id} saved`,
        type: 'success'
      }
      return promiseMap(data)
    })
    .then(data => genericPersonHandler(data, params.personId))
}

function genericPersonHandler (data, personId) {
  return people.getAll(data)
    .then(data => people.get(data, personId))
    // Referrals associated with this person
    .then(data => jobs.getAll(data))
    .then(addDataKeyValue('companies', companies.getAll))
    .then(data => hirers.getAll(data))
    .then(data => promiseMap(data)) // Do I need this?
    .then(data => smooshJobs(data))
    .then(data => jobs.getReferralsForPerson(data, personId))
    // Recommendations associated with this person
    .then(data => network.getByPerson(data, personId))
    // This person's hirer and company information
    .then(data => hirers.getFirstByPerson(data, data.person.id))
    .then(data => data.hirer ? addDataKeyValue('company', data => companies.get(data.hirer.company))(data) : data)
    .then(data => data.hirer ? tasks.getAllByHirerAndCompany(data, data.hirer.id, data.hirer.company) : data)
}

function smooshJob (data, job) {
  const relatedCompany = data.companies.find(company => company.id === job.company)
  const relatedHirers = data.hirers.filter(hirer => hirer.company === job.company)
  const hirers = relatedHirers.map(hirer => {
    const person = data.people.find(person => person.id === hirer.person)
    return merge({}, hirer, { person })
  })
  const company = merge({}, relatedCompany, { hirers })
  return merge({}, job, { company })
}

function smooshJobs (data) {
  data.expandedJobs = data.jobs.map(job => smooshJob(data, job))
  return promiseMap(data)
}

module.exports = {
  get,
  put,
  postReferral,
  postRecommendation,
  postTask
}
