/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const { merge } = require('@nudj/library')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

const { standardPostReferralResponse } = require('../helpers/responses')
const fetchers = require('../../../../app/pages/company-job/fetchers')

describe('Company-job postReferral fetcher', () => {
  const api = nock('http://api:81')
  const body = {
    id: 'jobId',
    email: 'test@email.com'
  }
  const params = {
    companySlug: 'fake-company',
    jobSlug: 'fake-job'
  }

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

  it('should return the page data', () => {
    return expect(fetchers.postReferral({
      data: {},
      params,
      body
    })).to.eventually.deep.equal(standardPostReferralResponse)
  })

  it('should append any passed data', () => {
    return expect(fetchers.postReferral({
      data: {
        provided: 'important-data'
      },
      params,
      body
    })).to.eventually.deep.equal(merge({ provided: 'important-data' }, standardPostReferralResponse))
  })

  it('should overwrite passed data with page data', () => {
    return expect(fetchers.postReferral({
      data: {
        job: 'Tester'
      },
      params,
      body
    })).to.eventually.deep.equal(standardPostReferralResponse)
  })
})
