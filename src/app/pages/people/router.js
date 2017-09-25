const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/people', respondWith(fetchers.get))
  router.postHandlers('/people', respondWith(fetchers.post))

  return router
}

module.exports = Router
