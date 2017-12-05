const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/survey-sections/new', respondWithGql(fetchers.getNew))
  router.getHandlers('/survey-sections/:id', respondWithGql(fetchers.getOne))

  router.postHandlers('/survey-sections/new', respondWithGql(fetchers.postSection))
  router.patchHandlers('/survey-sections/:id', respondWithGql(fetchers.patchSection))

  return router
}

module.exports = Router
