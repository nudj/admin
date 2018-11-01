const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/surveys/:surveyId/questions/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/surveys/:surveyId/questions/:id', respondWithGql(fetchers.getOne))

  router.postHandlers('/surveys/:surveyId/questions/new', respondWithGql(fetchers.postQuestion))
  router.patchHandlers('/surveys/:surveyId/questions/:id', respondWithGql(fetchers.patchQuestion))

  return router
}

module.exports = Router
