const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/survey/:surveyId/sections', respondWithGql(fetchers.get))
  router.patchHandlers('/survey/:surveyId/sections', respondWithGql(fetchers.patch))

  return router
}

module.exports = Router
