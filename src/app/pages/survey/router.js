const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.postHandlers('/survey/new', respondWith(fetchers.postSurvey))
  router.patchHandlers('/survey/:id', respondWith(fetchers.patchSurvey))
  router.getHandlers('/survey/new', respondWith(fetchers.getNew))
  router.getHandlers('/survey/:id', respondWith(fetchers.getOne))

  return router
}

module.exports = Router
