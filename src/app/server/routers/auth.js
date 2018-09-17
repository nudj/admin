const express = require('express')
const passport = require('passport')
const get = require('lodash/get')
const { AppError } = require('@nudj/framework/errors')
const logger = require('@nudj/framework/logger')
const { Analytics } = require('@nudj/library/server')
const { omitUndefined } = require('@nudj/library')

const requestGql = require('../../lib/requestGql')

function cacheReturnTo (req, res, next) {
  if (!req.session.returnTo) {
    req.session.returnTo = req.get('Referrer')
  }
  next()
}

async function fetchPerson (email) {
  try {
    const gql = `
      query GetPerson ($email: String!) {
        person: personByFilters(filters:{ email: $email }) {
          id
          firstName
          lastName
          email
          hirer {
            company {
              name
            }
          }
        }
      }
    `

    const variables = { email }

    const data = await requestGql(null, gql, variables)
    if (!data.person) throw new Error('Error fetching person')
    return data
  } catch (error) {
    logger.log('error', error.log || error)
    throw error
  }
}

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  let router = express.Router()

  // Perform session logout and redirect to last known page or homepage
  router.get('/logout', (req, res, next) => {
    req.logOut()
    delete req.session.data
    delete req.session.userId
    delete req.session.analyticsEventProperties
    req.session.logout = true
    req.session.returnTo = req.query.returnTo
    res.clearCookie('connect.sid', {path: '/'})
    res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(`${process.env.PROTOCOL_DOMAIN}/loggedout`)}&client_id=${process.env.AUTH0_CLIENT_ID}`)
  })

  router.get('/loggedout', (req, res, next) => {
    const returnTo = req.session.returnTo
    req.session.destroy(() => res.redirect(returnTo || '/'))
  })

  router.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/login' }),
    async (req, res, next) => {
      if (!req.user) {
        return next(new AppError('User not returned from Auth0'))
      }

      const analytics = new Analytics({ app: 'admin', distinctId: req.cookies.mixpanelDistinctId })

      try {
        const data = await fetchPerson(req.user._json.email)
        const firstName = get(data, 'person.firstName')
        const lastName = get(data, 'person.lastName')
        const name = firstName && lastName ? `${firstName} ${lastName}` : undefined

        req.session.userId = data.person.id
        req.session.analyticsEventProperties = omitUndefined({
          name,
          $email: get(data, 'person.email'),
          companyName: get(data, 'person.hirer.company.name')
        })

        await analytics.identify(
          { id: req.session.userId },
          req.session.analyticsEventProperties,
          {
            preserveTraits: true
          }
        )

        analytics.track({
          object: analytics.objects.user,
          action: analytics.actions.user.loggedIn
        })

        res.redirect(req.session.returnTo || '/')
      } catch (error) {
        next(new AppError('Unable to login', req.user._json.email, error))
      }
    }
  )

  router.get('/login', cacheReturnTo, passport.authenticate('auth0', {}), (req, res, next) => res.redirect(req.session.returnTo || '/'))

  return router
}

module.exports = Router
