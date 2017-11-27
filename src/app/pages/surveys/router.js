const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/surveys', respondWith(fetchers.get))
  router.getHandlers('/surveys/new', respondWith(fetchers.getNew))
  router.postHandlers('/surveys/new', respondWith(fetchers.postSurvey))
  // router.getHandlers('/surveys/:id', respondWith(fetchers.getId))

  return router
}

module.exports = Router
