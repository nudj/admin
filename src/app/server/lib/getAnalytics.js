const get = require('lodash/get')
const logger = require('@nudj/framework/logger')
const { Analytics } = require('@nudj/library/server')
const { omitUndefined } = require('@nudj/library')

const requestGql = require('../../lib/requestGql')

async function fetchPerson (id) {
  try {
    const gql = `
      query GetPerson ($id: ID!) {
        person(id: $id) {
          id
          firstName
          lastName
          email
          hirer {
            type
            company {
              name
            }
          }
        }
      }
    `

    const variables = { id }

    const data = await requestGql(null, gql, variables)
    if (!data.person) throw new Error('Error fetching person')
    return data
  } catch (error) {
    logger.log('error', error.log || error)
    throw error
  }
}

async function getAnalytics (req) {
  if (req.session.userId && !req.session.analyticsEventProperties) {
    // A user exists and has no event properties, fetch them.
    try {
      const response = await fetchPerson(req.session.userId)

      const firstName = get(response, 'person.firstName')
      const lastName = get(response, 'person.lastName')
      const name = firstName && lastName ? `${firstName} ${lastName}` : undefined

      req.session.analyticsEventProperties = omitUndefined({
        name,
        $email: get(response, 'person.email'),
        companyName: get(response, 'person.hirer.company.name'),
        hirerType: get(response, 'person.hirer.type')
      })
    } catch (error) {
      console.error(`Error fetching analytics EventProperties for user ${req.session.userId}`, error)
    }
  }

  const analyticsData = omitUndefined({
    app: 'admin',
    distinctId: req.session.userId || req.cookies.mixpanelDistinctId,
    eventProperties: req.session.analyticsEventProperties,
    userTraits: req.session.analyticsEventProperties
  })

  const analytics = new Analytics(analyticsData)

  /**
   * Persists the session equivalent of `analytics.traits` and
   * `analytics.eventProperties` whenever they're changed down the chain, e.g.,
   * through the use of `analytics.updateIdentity`
   */
  analytics.onEventPropertiesChange((update) => {
    req.session.analyticsEventProperties = update
  })

  return analytics
}

module.exports = getAnalytics
