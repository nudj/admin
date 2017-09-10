const {
  merge,
  actionMapAssign
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const people = require('../../server/modules/people')
const jobs = require('../../server/modules/jobs')
const messages = require('../../server/modules/messages')
const tasks = require('../../server/modules/tasks')
const surveys = require('../../server/modules/surveys')
const hirers = require('../../server/modules/hirers')

const addPeopleToHirers = (hirers, people) => hirers.map(hirer => {
  const person = people.find(person => person.id === hirer.person)
  return merge(hirer, { person })
})

const addPageData = (companySlug) => [
  {
    company: data => data.company || companies.get(companySlug),
    companies: data => companies.getAll(),
    people: data => people.getAll(data).then(data => data.people)
  },
  {
    survey: data => data.survey || surveys.getSurveyForCompany({}, data.company.id).then(data => data.survey),
    jobs: data => jobs.getAll({}, data.company.id).then(data => data.jobs),
    hirers: data => hirers.getAllByCompany(data, data.company.id).then(data => addPeopleToHirers(data.hirers, data.people)),
    surveyMessages: data => messages.getAllFor({}, data.company.id).then(data => data.surveyMessages),
    tasks: data => tasks.getAllByCompany({}, data.company.id).then(data => data.tasks)
  }
]

function get ({
  data,
  params
}) {
  return actionMapAssign(
    data,
    ...addPageData(params.companySlug)
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
      notification: data => ({
        message: `${data.company.name} saved`,
        type: 'success'
      })
    },
    ...addPageData(params.companySlug)
  )
}

function postJob ({
  data,
  params,
  body
}) {
  return actionMapAssign(
    data,
    {
      company: () => companies.get(params.companySlug)
    },
    {
      newJob: data => jobs.post({}, merge(body, { company: data.company.id })).then(data => data.newJob)
    },
    {
      notification: data => ({
        message: `${data.newJob.title} added`,
        type: 'success'
      })
    },
    ...addPageData(params.companySlug)
  )
}

function postHirer ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const email = body.email

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug),
      newPerson: () => people.post({}, { email }).then(data => data.newPerson)
    },
    {
      newHirer: data => hirers.post({}, {
        company: data.company.id,
        person: data.newPerson.id
      }).then(data => data.newHirer)
    },
    {
      notification: data => ({
        message: `New person and hirer added`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function postHirerPerson ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const person = params.person

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug)
    },
    {
      newHirer: data => hirers.post({}, {
        company: data.company.id,
        person
      }).then(data => data.newHirer)
    },
    {
      notification: data => ({
        message: `New hirer added`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function postSurvey ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug)
    },
    {
      survey: data => surveys.post({}, merge(body, { company: data.company.id })).then(data => data.survey)
    },
    {
      notification: data => ({
        message: `Survey added`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function patchSurvey ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const surveyId = params.surveyId

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug)
    },
    {
      survey: data => surveys.patch({}, surveyId, merge(body, { company: data.company.id })).then(data => data.survey)
    },
    {
      notification: data => ({
        message: `Survey updated`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
}

function postTask ({
  data,
  params,
  body
}) {
  const companySlug = params.companySlug
  const type = params.taskType

  return actionMapAssign(
    data,
    {
      company: () => companies.get(companySlug)
    },
    {
      newTask: data => {
        const company = data.company.id
        return tasks.post({}, { company, type }).then(data => data.newTask)
      }
    },
    {
      notification: data => ({
        message: `New ${data.newTask.type} task saved`,
        type: 'success'
      })
    },
    ...addPageData(companySlug)
  )
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
