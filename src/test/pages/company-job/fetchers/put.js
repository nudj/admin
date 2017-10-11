/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const merge = require('lodash/merge')
const nock = require('nock')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

const fetchers = require('../../../../app/pages/company-job/fetchers')

const standardPutResponse = {
  activities: {
    applications: {
      lastWeek: 0,
      thisWeek: 0,
      total: 1,
      trend: 0
    },
    pageViews: {
      lastWeek: 0,
      thisWeek: 0,
      total: 0,
      trend: 0
    },
    referrers: {
      lastWeek: 0,
      thisWeek: 0,
      total: 1,
      trend: 0
    }
  },
  company: { id: 'companyId' },
  notification: {
    message: 'Job Title saved',
    type: 'success'
  },
  job: {
    id: 'jobId',
    title: 'Job Title'
  },
  savedJob: {
    id: 'jobId',
    title: 'Job Title'
  },
  jobs: ['jobsResponse'],
  people: ['peopleResponse'],
  applications: [
    {
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'McTest',
      person: 'personId'
    }
  ],
  referrals: [
    {
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'McTest',
      person: 'personId'
    }
  ]
}

describe('Company-job fetcher', () => {
  const api = nock('http://api:81')
  beforeEach(() => {
    api
      .patch('/jobs/jobId')
      .reply(200, { id: 'jobId', title: 'Job Title' })
    api
      .get('/companies/filter')
      .query({ slug: 'fake-company' })
      .reply(200, [{ id: 'companyId' }])
    api
      .get('/jobs')
      .reply(200, ['jobsResponse'])
    api
      .get('/applications/filter')
      .query({ job: 'jobId' })
      .times(2)
      .reply(200, [{ person: 'personId' }])
    api
      .get('/referrals/filter')
      .query({ job: 'jobId' })
      .times(2)
      .reply(200, [{ person: 'personId' }])
    api
      .get('/people')
      .reply(200, ['peopleResponse'])
    api
      .get('/people/personId')
      .times(2)
      .reply(200, { email: 'test@email.com', firstName: 'Test', lastName: 'McTest' })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('put', () => {
    const body = {
      id: 'jobId'
    }
    const params = {
      companySlug: 'fake-company'
    }

    it('should return the page data', () => {
      return expect(fetchers.put({
        data: {},
        params,
        body
      })).to.eventually.deep.equal(standardPutResponse)
    })

    it('should append any passed data', () => {
      return expect(fetchers.put({
        data: {
          provided: 'important-data'
        },
        params,
        body
      })).to.eventually.deep.equal(merge({ provided: 'important-data' }, standardPutResponse))
    })

    it('should overwrite passed data with page data', () => {
      return expect(fetchers.put({
        data: {
          job: 'Tester'
        },
        params,
        body
      })).to.eventually.deep.equal(standardPutResponse)
    })
  })
})
