const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/people', respondWithGql(fetchers.get))
  router.postHandlers('/people', respondWithGql(fetchers.post))

  return router
}

module.exports = Router
