const express = require('express')
const passport = require('passport')
const { LogThenError } = require('@nudj/framework/errors')
const { promiseMap } = require('@nudj/library')
const people = require('../modules/people')

function cacheReturnTo (req, res, next) {
  if (!req.session.returnTo) {
    req.session.returnTo = req.get('Referrer')
  }
  next()
}

function fetchPerson (email) {
  const data = {}
  people.getByEmail(data, email)
    .then(data => {
      if (data.person.error) throw new LogThenError('Unable to fetch person')
      return data
    })

  return promiseMap(data)
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
    (req, res, next) => {
      if (!req.user) {
        return next(new LogThenError('User not returned from Auth0'))
      }

      fetchPerson(req.user._json.email)
        .then((data) => {
          req.session.data = data
          res.redirect(req.session.returnTo || '/')
        })
        .catch((error) => {
          next(new LogThenError('Unable to login', req.user._json.email, error))
        })
    }
  )

  router.get('/login', cacheReturnTo, passport.authenticate('auth0', {}), (req, res, next) => res.redirect(req.session.returnTo || '/'))

  return router
}

module.exports = Router
