const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.postHandlers('/survey/new', respondWithGql(fetchers.postSurvey))
  router.patchHandlers('/survey/:id', respondWithGql(fetchers.patchSurvey))
  router.getHandlers('/survey/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/survey/:id', respondWithGql(fetchers.getOne))

  return router
}

module.exports = Router
