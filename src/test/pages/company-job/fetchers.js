/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const proxyquire = require('proxyquire')
const merge = require('lodash/merge')
const nock = require('nock')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

const fetchers = proxyquire('../../../app/pages/company-job/fetchers', {
  '../../server/modules/prismic': () => ({ fetchAllJobTags: () => 'prismicTagsResponse' })
})

const standardGetResponse = {
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
  job: { id: 'jobId' },
  jobs: ['jobsResponse'],
  people: ['peopleResponse'],
  jobTemplateTags: 'prismicTagsResponse',
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

describe('Companies fetchers', () => {
  const api = nock('http://api:81')
  const params = {
    jobSlug: 'fake-test-job',
    companySlug: 'fake-company'
  }

  beforeEach(() => {
    api
      .get('/companies/filter')
      .query({ slug: 'fake-company' })
      .reply(200, [{ id: 'companyId' }])
    api
      .get('/jobs/filter')
      .query({ slug: 'fake-test-job', company: 'companyId' })
      .reply(200, [{ id: 'jobId' }])
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

  describe('get', () => {
    it('should resolve with the page data', () => {
      return expect(fetchers.get({
        data: {},
        params
      })).to.eventually.deep.equal(standardGetResponse)
    })

    it('should append any passed data', () => {
      return expect(fetchers.get({
        data: {
          provided: 'important-data'
        },
        params
      })).to.eventually.deep.equal(merge({ provided: 'important-data' }, standardGetResponse))
    })

    it('should overrite passed data with page data', () => {
      return expect(fetchers.get({
        data: {
          company: 'Testing Inc.'
        },
        params
      })).to.eventually.deep.equal(standardGetResponse)
    })
  })
})
