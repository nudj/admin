const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.postHandlers('/surveys/new', respondWithGql(fetchers.postSurvey))
  router.patchHandlers('/surveys/:id', respondWithGql(fetchers.patchSurvey))
  router.getHandlers('/surveys/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/surveys/:id', respondWithGql(fetchers.getOne))

  return router
}

module.exports = Router
