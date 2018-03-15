/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const nock = require('nock')
const expect = chai.expect
chai.use(dirtyChai)

nock.emitter.on('no match', function (req) {
  console.log('No match for request:', req)
})

describe('This', function () {
  it('should work', function () {
    expect(true).to.be.true()
  })
})
