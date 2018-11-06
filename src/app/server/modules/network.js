const get = require('lodash/get')
const mapValues = require('lodash/mapValues')
const {
  merge,
  promiseMap
} = require('@nudj/library')

const request = require('@nudj/framework/request')
const mailer = require('../lib/mailer')
const templater = require('@nudj/framework/templater')
const logger = require('@nudj/framework/logger')
const { emails: validators } = require('@nudj/framework/validators')

function validate (formData, data) {
  let invalid
  data.form = mapValues(formData, (value, key) => {
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
    data.invalid = true
  }
  return data
}

function sendEmails ({ recipients, subject, template }) {
  return (data) => {
    data = validate({ recipients, subject, template }, data)
    if (data.invalid) {
      delete data.messages
      delete data.invalid
      data.notification = {
        type: 'error',
        message: 'Invalid form data'
      }
      return promiseMap(data)
    }
    let html = renderMessage({ data, template }).join('')
    data.notifications = Promise.all(recipients.replace(' ', '').split(',').map(sendEmail({ subject, html })))
    return promiseMap(data)
  }
}

function renderMessage ({ data, template }) {
  const companySlug = get(data, 'company.slug', '')
  const jobSlug = get(data, 'job.slug', '')
  const webHostname = get(this.props, 'web.hostname')

  return templater.render({
    template,
    data: {
      company: {
        name: get(data, 'company.name', '')
      },
      job: {
        bonus: get(data, 'job.bonus', ''),
        link: `https://${webHostname}/jobs/${companySlug}+${jobSlug}`, // ?
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

function fetchNetworkForJob (data, hirer, job) {
  data.network = request(`recommendations/filter?hirer=${hirer}&job=${job}&source=HIRER`)
    .then(common.fetchPeopleFromFragments)

  data.nudjNetwork = request(`recommendations/filter?hirer=${hirer}&job=${job}&source=NUDJ`)
    .then(common.fetchPeopleFromFragments)

  return promiseMap(data)
}

function fetchNetworkForJobAndPerson (data, hirer, job, person) {
  data.recommendation = request(`recommendations/filter?hirer=${hirer}&job=${job}&person=${person}&source=HIRER`)
    .then(common.fetchPeopleFromFragments)

  return promiseMap(data)
}

function fetchNetworksForPerson (data, person) {
  data.recommendations = request(`recommendations/filter?person=${person}&source=HIRER`)
  return promiseMap(data)
}

function fetchNetwork (data, hirer, job) {
  data.network = request(`recommendations/filter?hirer=${hirer}`)
    .then(common.fetchPeopleFromFragments)
  return promiseMap(data)
}

function createNetwork (hirer, job, person, source = 'HIRER') {
  const type = 'external'
  const data = {hirer, job, person, source, type}
  const method = 'post'
  return request('recommendations', { data, method })
}

module.exports.get = function (data, hirer, job) {
  return fetchNetworkForJob(data, hirer, job)
}

module.exports.getById = function (data, hirer, job, person) {
  return fetchNetworkForJobAndPerson(data, hirer, job, person)
}

module.exports.getByPerson = function (data, person) {
  return fetchNetworksForPerson(data, person)
}

module.exports.getAll = function (data, hirer) {
  return fetchNetwork(data, hirer)
}

module.exports.post = function (data, hirer, job, person) {
  data.recommendation = createNetwork(hirer, job, person)
  return promiseMap(data)
}