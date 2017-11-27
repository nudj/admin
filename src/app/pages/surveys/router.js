const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/surveys', respondWith(fetchers.get))
  router.postHandlers('/surveys', respondWith(fetchers.postSurvey))
  router.patchHandlers('/surveys/:id', respondWith(fetchers.patchSurvey))
  router.getHandlers('/surveys/new', respondWith(fetchers.getNew))
  router.getHandlers('/surveys/:id', respondWith(fetchers.getOne))

  return router
}

module.exports = Router
