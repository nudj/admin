const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/companies/:companySlug/jobs/:jobSlug', respondWithGql(fetchers.get))
  router.putHandlers('/companies/:companySlug/jobs/:jobSlug', respondWith(fetchers.put))
  router.postHandlers('/companies/:companySlug/jobs/:jobSlug/referrals', respondWith(fetchers.postReferral))
  router.postHandlers('/companies/:companySlug/jobs/:jobSlug/referrals/:personId', respondWith(fetchers.postReferralPerson))

  return router
}

module.exports = Router
