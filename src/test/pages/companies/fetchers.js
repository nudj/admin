/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(dirtyChai)

const fetchers = require('../../../app/pages/companies/fetchers')

describe('Companies fetchers', () => {
  const api = nock('http://api:81')

  beforeEach(() => {
    api
      .get('/companies')
      .reply(200, ['getAllResponse'])
  })
  afterEach(() => {
    nock.cleanAll()
  })

  describe('get', () => {
    it('should resolve with the page data', () => {
      return expect(fetchers.get({
        data: {}
      })).to.eventually.deep.equal({
        companies: ['getAllResponse']
      })
    })

    it('should append any passed data', () => {
      return expect(fetchers.get({
        data: {
          passed: 'data'
        }
      })).to.eventually.deep.equal({
        passed: 'data',
        companies: ['getAllResponse']
      })
    })

    it('should overrite passed data with page data', () => {
      return expect(fetchers.get({
        data: {
          companies: 'passed'
        }
      })).to.eventually.deep.equal({
        companies: ['getAllResponse']
      })
    })
  })

  describe('post', () => {
    const body = {
      post: 'data'
    }
    const postResponse = {
      name: 'New name'
    }

    beforeEach(() => {
      api
        .post('/companies', body)
        .reply(200, postResponse)
    })

    it('should return the page data', () => {
      return expect(fetchers.post({
        data: {},
        body
      })).to.eventually.deep.equal({
        companies: ['getAllResponse'],
        newCompany: postResponse,
        notification: {
          type: 'success',
          message: 'New name added'
        }
      })
    })
    it('should append any passed data', () => {
      return expect(fetchers.post({
        data: {
          passed: 'data'
        },
        body
      })).to.eventually.deep.equal({
        passed: 'data',
        companies: ['getAllResponse'],
        newCompany: postResponse,
        notification: {
          type: 'success',
          message: 'New name added'
        }
      })
    })
    it('should overrite passed data with page data', () => {
      return expect(fetchers.post({
        data: {
          companies: 'passed'
        },
        body
      })).to.eventually.deep.equal({
        companies: ['getAllResponse'],
        newCompany: postResponse,
        notification: {
          type: 'success',
          message: 'New name added'
        }
      })
    })
  })
})
