/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const merge = require('lodash/merge')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

const fetchers = require('../../../../app/pages/company-job/fetchers')

const standardPostReferralPersonResponse = {
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
    message: 'New referral referralId saved',
    type: 'success'
  },
  job: { id: 'jobId' },
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
  referral: { id: 'referralId' },
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
      .get('/jobs/filter')
      .query({ slug: 'fake-job', company: 'companyId' })
      .reply(200, [{ id: 'jobId' }])
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
      .post('/referrals')
      .reply(200, { id: 'referralId' })
    api
      .get('/referrals/filter')
      .query({ job: 'jobId' })
      .times(2)
      .reply(200, [{ person: 'personId' }])
    api
      .post('/people')
      .reply(200, ['peoplePostResponse'])
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

  describe('postReferralPerson', () => {
    const params = {
      companySlug: 'fake-company',
      personId: 'personId',
      jobSlug: 'fake-job'
    }

    it('should return the page data', () => {
      return expect(fetchers.postReferralPerson({
        data: {},
        params,
        body: {}
      })).to.eventually.deep.equal(standardPostReferralPersonResponse)
    })

    it('should append any passed data', () => {
      return expect(fetchers.postReferralPerson({
        data: {
          provided: 'important-data'
        },
        params,
        body: {}
      })).to.eventually.deep.equal(merge({ provided: 'important-data' }, standardPostReferralPersonResponse))
    })

    it('should overwrite passed data with page data', () => {
      return expect(fetchers.postReferralPerson({
        data: {
          job: 'Tester'
        },
        params,
        body: {}
      })).to.eventually.deep.equal(standardPostReferralPersonResponse)
    })
  })
})
