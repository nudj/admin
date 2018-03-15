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
const fetchers = proxyquire('../../../../../app/pages/company/fetchers', {
  '../../server/modules/prismic': () => ({ fetchAllJobTags: () => 'prismicTagsResponse' })
})

describe('Company get fetcher', () => {
  const api = nock('http://api:81')
  const params = {
    companySlug: 'fake-company'
  }

  beforeEach(() => {
    api
      .get('/companies')
      .reply(200, ['allCompanies'])

    api
      .get('/surveys/filter')
      .query({ type: 'EMPLOYEE_SURVEY', company: 'companyId' })
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
    })).to.eventually.deep.equal(merge(standardGetResponse, { provided: 'important-data' }))
  })

  it('should overwrite passed data with page data', () => {
    return expect(fetchers.get({
      data: {
        people: ['List of Testers']
      },
      params
    })).to.eventually.deep.equal(standardGetResponse)
  })
})
