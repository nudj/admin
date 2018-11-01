const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/surveys/:surveyId/questions', respondWithGql(fetchers.get))
  router.patchHandlers('/surveys/:surveyId/questions', respondWithGql(fetchers.patch))

  return router
}

module.exports = Router
