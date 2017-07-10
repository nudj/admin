const get = require('lodash/get')
const mapValues = require('lodash/mapValues')
const NudjError = require('../../lib/error')
const request = require('../../lib/request')
const mailer = require('../lib/mailer')
const templater = require('../../lib/templater')
const { promiseMap } = require('../lib')
const { merge } = require('../../lib')
const logger = require('../../lib/logger')
const { emails: validators } = require('../../lib/validators')

function validate (formData, data) {
  let invalid
  formData = mapValues(formData, (value, key) => {
    const error = validators[key](value)
    if (error) {
      invalid = true
    }
    return {
      value,
      error
    }
  })
  if (invalid) {
    throw new NudjError(`Invalid form data`, 'invalid-form', formData)
  }
  data.form = formData
  return data
}

function sendEmails ({ recipients, subject, template }) {
  return (data) => {
    try {
      data = validate({ recipients, subject, template }, data)
      let html = renderMessage({ data, template }).join('')
      data.messages = Promise.all(recipients.replace(' ', '').split(',').map(sendEmail({ subject, html })))
    } catch (error) {
      if (error.name !== 'NudjError') {
        return Promise.reject(error)
      }
      data = handleError(error, data)
    }
    return promiseMap(data)
  }
}

function handleError (error, data) {
  delete data.messages
  data.form = error.data
  data.notification = {
    type: 'error',
    message: error.message
  }
  return data
}

function renderMessage ({ data, template }) {
  const companySlug = get(data, 'company.slug', '')
  const jobSlug = get(data, 'job.slug', '')

  return templater.render({
    template,
    data: {
      company: {
        name: get(data, 'company.name', '')
      },
      job: {
        bonus: get(data, 'job.bonus', ''),
        link: `https://nudj.co/jobs/${companySlug}+${jobSlug}`, // ?
        title: get(data, 'job.title', '')
      },
      sender: {
        firstname: get(data, 'person.firstName', ''),
        lastname: get(data, 'person.lastName', '')
      }
    },
    pify: (contents, index, margin = 0) => `<p style="margin-top:${1.5 * margin}rem;">${contents.join('')}</p>`
  })
}

function sendEmail ({ subject, html }) {
  return (to) => mailer.send({
    from: 'hello@nudj.co',
    to,
    subject,
    html
  })
}

module.exports.send = function (data, instructions) {
  return sendEmails(instructions)(data)
  .catch((error) => {
    logger.log('error', error)
    return merge(data, {
      messages: null,
      form: mapValues(instructions, (value) => ({ value })),
      notification: {
        type: 'error',
        message: 'There was a problem sending your email, please try again'
      }
    })
  })
}

const common = require('./common')

function fetchNetworkForJob (data, hirerId, jobId) {
  data.network = request(`recommendations/filter?hirerId=${hirerId}&jobId=${jobId}&source=hirer`)
    .then(common.fetchPeopleFromFragments)

  data.nudjNetwork = request(`recommendations/filter?hirerId=${hirerId}&jobId=${jobId}&source=nudj`)
    .then(common.fetchPeopleFromFragments)

  return promiseMap(data)
}

function fetchNetworkForJobAndPerson (data, hirerId, jobId, personId) {
  data.recommendation = request(`recommendations/filter?hirerId=${hirerId}&jobId=${jobId}&personId=${personId}&source=hirer`)
    .then(common.fetchPeopleFromFragments)

  return promiseMap(data)
}

function fetchNetwork (data, hirerId, jobId) {
  data.network = request(`recommendations/filter?hirerId=${hirerId}`)
    .then(common.fetchPeopleFromFragments)
  return promiseMap(data)
}

module.exports.get = function (data, hirerId, jobId) {
  return fetchNetworkForJob(data, hirerId, jobId)
}

module.exports.getById = function (data, hirerId, jobId, personId) {
  return fetchNetworkForJobAndPerson(data, hirerId, jobId, personId)
}

module.exports.getAll = function (data, hirerId) {
  return fetchNetwork(data, hirerId)
}
