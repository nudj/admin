let express = require('express')
let passport = require('passport')
let request = require('../../lib/request')
let logger = require('../lib/logger')
let { promiseMap } = require('../lib')

function cacheReturnTo (req, res, next) {
  if (!req.session.returnTo) {
    req.session.returnTo = req.get('Referrer')
  }
  next()
}

function fetchPerson (email) {
  let person = request(`people/first?email=${encodeURIComponent(email)}`)
  .then((person) => {
    if (!person) {
      person = request(`people`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      })
    }
    if (person.error) throw new Error('Unable to fetch person')
    return person
  })
  .then((person) => {
    if (person.error) throw new Error('Unable to create new person')
    return person
  })

  return promiseMap({
    person
  })
}

function fetchCompany (data) {
  data.company = request(`hirers/first?personId=${data.person.id}`)
  .then((hirer) => {
    if (!hirer) throw new Error('Not a registered hirer')
    if (hirer.error) throw new Error('Error fetching hirer')
    return request(`companies/${hirer.companyId}`)
  })
  .then((company) => {
    if (!company) throw new Error('Company not found')
    if (company.error) throw new Error('Error fetching company')
    return company
  })
  return promiseMap(data)
}

let router = express.Router()

// Perform session logout and redirect to last known page or homepage
router.get('/logout', (req, res, next) => {
  req.logOut()
  delete req.session.data
  req.session.logout = true
  req.session.returnTo = req.query.returnTo
  res.clearCookie('connect.sid', {path: '/'})
  res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(`http://${process.env.DOMAIN}/loggedout`)}&client_id=${process.env.AUTH0_CLIENT_ID}`)
})

router.get('/loggedout', (req, res, next) => {
  const returnTo = req.session.returnTo
  req.session.destroy(() => res.redirect(returnTo || '/'))
})

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  (req, res, next) => {
    if (!req.user) {
      logger.log('error', 'User not returned from Auth0')
      return next('Unable to login')
    }

    fetchPerson(req.user._json.email)
    .then(fetchCompany)
    .then((data) => {
      req.session.data = data
      res.redirect(req.session.returnTo || '/')
    })
    .catch((error) => {
      logger.log('error', error)
      next('Unable to login')
    })
  }
)

router.get('/login', cacheReturnTo, passport.authenticate('auth0', {}), (req, res, next) => res.redirect(req.session.returnTo || '/'))

module.exports = router
