const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/people/:personId', respondWithGql(fetchers.get))
  router.putHandlers('/people/:personId', respondWithGql(fetchers.put))
  router.postHandlers('/people/:personId/referrals/:jobId', respondWith(fetchers.postReferral))

  return router
}

module.exports = Router
