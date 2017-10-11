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

const { standardGetResponse } = require('../helpers/responses')
const fetchers = proxyquire('../../../../app/pages/company-job/fetchers', {
  '../../server/modules/prismic': () => ({ fetchAllJobTags: () => 'prismicTagsResponse' })
})

describe('Company-job get fetcher', () => {
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

  it('should overwrite passed data with page data', () => {
    return expect(fetchers.get({
      data: {
        company: 'Testing Inc.'
      },
      params
    })).to.eventually.deep.equal(standardGetResponse)
  })
})
