const { merge } = require('@nudj/library')

const baseFetcherResponse = {
  companies: [ 'allCompanies' ],
  company: { id: 'companyId' },
  hirerSurvey: 'surveyResponse',
  hirers: [
    {
      id: 'hirerId',
      person: 'peopleResponse'
    }
  ],
  jobs: [ 'jobResponse' ],
  people: [ 'peopleResponse' ],
  survey: 'surveyResponse',
  surveyMessages: [ 'hirerResponse' ],
  tasks: [ 'taskResponse' ],
  jobTemplateTags: 'prismicTagsResponse'
}

const standardGetResponse = baseFetcherResponse
const standardPatchSurveyResponse = merge(baseFetcherResponse, {
  notification: {
    message: 'Survey updated',
    type: 'success'
  }
})

const standardPostHirerPersonResponse = merge(baseFetcherResponse, {
  newHirer: { id: 'hirerId' },
  notification: {
    message: 'New hirer added',
    type: 'success'
  }
})

const standardPutResponse = merge(baseFetcherResponse, {
  company: { id: 'companyId', name: 'Testing Inc.' },
  notification: {
    message: 'Testing Inc. saved',
    type: 'success'
  }
})

const standardPostTaskResponse = merge(baseFetcherResponse, {
  newTask: {
    id: 'taskId',
    type: 'TEST'
  },
  notification: {
    message: 'New TEST task saved',
    type: 'success'
  }
})

const standardPostSurveyResponse = merge(baseFetcherResponse, {
  notification: {
    message: 'Survey added',
    type: 'success'
  }
})

const standardPostJobResponse = merge(baseFetcherResponse, {
  newJob: { title: 'jobTitle' },
  notification: {
    message: 'jobTitle added',
    type: 'success'
  }
})

const standardPostHirerResponse = merge(baseFetcherResponse, {
  newHirer: { id: 'hirerId' },
  newPerson: { id: 'personId' },
  notification: {
    message: 'New person and hirer added',
    type: 'success'
  }
})

module.exports = {
  standardGetResponse,
  standardPatchSurveyResponse,
  standardPostHirerPersonResponse,
  standardPostHirerResponse,
  standardPostJobResponse,
  standardPostSurveyResponse,
  standardPostTaskResponse,
  standardPutResponse
}
