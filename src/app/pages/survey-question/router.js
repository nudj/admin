const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/survey-questions/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/survey-questions/:id', respondWithGql(fetchers.getOne))

  router.postHandlers('/survey-questions/new', respondWithGql(fetchers.postQuestion))
  router.patchHandlers('/survey-questions/:id', respondWithGql(fetchers.patchQuestion))

  return router
}

module.exports = Router
