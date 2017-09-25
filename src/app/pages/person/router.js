const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/people/:personId', respondWith(fetchers.get))
  router.putHandlers('/people/:personId', respondWith(fetchers.put))
  router.postHandlers('/people/:personId/referrals/:jobSlug', respondWith(fetchers.postReferral))
  router.postHandlers('/people/:personId/recommendations/:jobSlug', respondWith(fetchers.postRecommendation))
  router.postHandlers('/people/:personId/tasks/:taskType', respondWith(fetchers.postTask))

  return router
}

module.exports = Router
