const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/:companySlug/jobs/:jobSlug', respondWith(fetchers.get))
  router.putHandlers('/:companySlug/jobs/:jobSlug', respondWith(fetchers.put))
  router.postHandlers('/:companySlug/jobs/:jobSlug/referrals', respondWith(fetchers.postReferral))
  router.postHandlers('/:companySlug/jobs/:jobSlug/referrals/:personId', respondWith(fetchers.postReferralPerson))

  return router
}

module.exports = Router
