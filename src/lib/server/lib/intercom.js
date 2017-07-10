let Intercom = require('intercom-client')
let logger = require('./logger')
let intercom = new Intercom.Client({
  token: process.env.INTERCOM_ACCESS_TOKEN
})

function getBody (response) {
  if (response.status !== 200) {
    throw new Error(`Intercom gone done broke: ${response.status}`)
  }
  return response.body
}

function getFirstFromResult (result) {
  return result.contacts[0]
}

function fetchLeadBy (filter) {
  return intercom.leads
    .listBy(filter)
    .then(getBody)
    .then(getFirstFromResult)
}

function createLead (data) {
  return intercom.leads
    .create(data)
    .then(getBody)
}

function tagUser (user, tag) {
  return intercom.tags
    .tag({
      name: tag,
      users: [{
        id: user.id
      }]
    })
    .then(getBody)
    .then(() => user)
}

function createUniqueLeadAndTag (data, tag) {
  logger.log('info', 'createUniqueLeadAndTag', data, tag)
  return fetchLeadBy({ email: data.email })
    .then((user) => user || createLead(data))
    .then((user) => tagUser(user, tag))
    .then((user) => {
      logger.log('info', 'User created and tagged', data, tag)
      return user
    })
    .catch((error) => logger.log('error', 'Intercom', 'createUniqueLeadAndTag', data, tag, error))
}

module.exports = {
  createUniqueLeadAndTag
}
