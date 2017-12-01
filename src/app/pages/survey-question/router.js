const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/survey-question/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/survey-question/:id', respondWithGql(fetchers.getOne))

  router.postHandlers('/survey-question/new', respondWithGql(fetchers.postQuestion))
  router.patchHandlers('/survey-question/:id', respondWithGql(fetchers.patchQuestion))

  return router
}

module.exports = Router
