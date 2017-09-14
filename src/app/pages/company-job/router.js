const express = require('express')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/:companySlug/jobs/:jobSlug', respondWith(fetchers.get))
  router.put('/:companySlug/jobs/:jobSlug', respondWith(fetchers.put))
  router.post('/:companySlug/jobs/:jobSlug/referrals', respondWith(fetchers.postReferral))
  router.post('/:companySlug/jobs/:jobSlug/referrals/:personId', respondWith(fetchers.postReferralPerson))

  return router
}

module.exports = Router
