/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const { merge } = require('@nudj/library')
const nock = require('nock')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

const { standardPutResponse } = require('../helpers/responses')
const fetchers = require('../../../../app/pages/company-job/fetchers')

describe('Company-job put fetcher', () => {
  const api = nock('http://api:81')
  const body = {
    id: 'jobId'
  }
  const params = {
    companySlug: 'fake-company'
  }

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
    })).to.eventually.deep.equal(merge(standardPutResponse, { provided: 'important-data' }))
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
