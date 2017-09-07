const {
  addDataKeyValue
} = require('@nudj/library')

const companies = require('../../server/modules/companies')
const messages = require('../../server/modules/messages')

function get ({
  data,
  params
}) {
  const companySlug = params.companySlug
  const surveyMessageId = params.surveyMessageId

  return Promise.resolve(data)
    .then(addDataKeyValue('company', () => companies.get(companySlug)))
    .then(data => messages.getOneById(data, surveyMessageId))
}

module.exports = {
  get
}
