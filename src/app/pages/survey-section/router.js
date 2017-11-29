const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/survey-section/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/survey-section/:id', respondWithGql(fetchers.getOne))

  router.postHandlers('/survey-section/new', respondWithGql(fetchers.postSection))
  router.patchHandlers('/survey-section/:id', respondWithGql(fetchers.patchSection))

  return router
}

module.exports = Router
