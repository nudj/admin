/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const proxyquire = require('proxyquire')
const { merge } = require('@nudj/library')
const nock = require('nock')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

// const { standardGetResponse } = require('../helpers/responses')
const fetchers = proxyquire('../../../../app/pages/company/fetchers', {
  '../../server/modules/prismic': () => ({ fetchAllJobTags: () => 'prismicTagsResponse' })
})

const standardPostTaskResponse = {
  companies: [ 'allCompanies' ],
  company: { id: 'companyId' },
  hirerSurvey: 'surveyResponse',
  hirers: [
    {
      id: 'hirerId',
      person: 'peopleResponse'
    }
  ],
  newTask: {
    id: 'taskId',
    type: 'TEST'
  },
  jobTemplateTags: 'prismicTagsResponse',
  jobs: [ 'jobResponse' ],
  people: [ 'peopleResponse' ],
  survey: 'surveyResponse',
  surveyMessages: [ 'hirerResponse' ],
  tasks: [ 'taskResponse' ],
  notification: {
    message: 'New TEST task saved',
    type: 'success'
  }
}

describe('Company postTask fetcher', () => {
  const api = nock('http://api:81')
  const body = {
    id: 'companyId'
  }
  const params = {
    companySlug: 'fake-company',
    person: 'TestMan'
  }

  beforeEach(() => {
    api
      .get('/companies')
      .times(18)
      .reply(200, ['allCompanies'])

    api
      .post('/tasks')
      .reply(200, { id: 'taskId', type: 'TEST' })

    api
      .get('/surveys/filter')
      .query({ type: 'EMPLOYEE_SURVEY', company: 'companyId' })
      .times(2)
      .reply(200, ['surveyResponse'])

    api
      .get('/surveys/filter')
      .query({ type: 'HIRER_SURVEY', company: 'companyId' })
      .reply(200, ['surveyResponse'])

    api
      .get('/jobs/filter')
      .query({ company: 'companyId' })
      .reply(200, ['jobResponse'])

    api
      .get('/hirers/filter')
      .query({ company: 'companyId' })
      .times(2)
      .reply(200, [{ id: 'hirerId' }])

    api
      .get('/surveyMessages/filter')
      .query({ hirer: 'hirerId' })
      .reply(200, ['hirerResponse'])

    api
      .get('/tasks/filter')
      .query({ company: 'companyId' })
      .reply(200, ['taskResponse'])

    api
      .get('/companies/filter')
      .query({ slug: 'fake-company' })
      .reply(200, [{ id: 'companyId' }])

    api
      .get('/people')
      .reply(200, ['peopleResponse'])
  })
  afterEach(() => {
    nock.cleanAll()
  })

  it('should resolve with the page data', () => {
    return expect(fetchers.postTask({
      data: {},
      params,
      body
    })).to.eventually.deep.equal(standardPostTaskResponse)
  })

  it('should append any passed data', () => {
    return expect(fetchers.postTask({
      data: {
        provided: 'important-data'
      },
      params,
      body
    })).to.eventually.deep.equal(merge({ provided: 'important-data' }, standardPostTaskResponse))
  })

  it('should overwrite passed data with page data', () => {
    return expect(fetchers.postTask({
      data: {
        jobs: ['Testing Job']
      },
      params,
      body
    })).to.eventually.deep.equal(standardPostTaskResponse)
  })
})
