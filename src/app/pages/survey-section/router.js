const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/survey-section/new', respondWithGql(fetchers.getNew))

  router.postHandlers('/survey-section/new', respondWithGql(fetchers.postSurvey))

  return router
}

module.exports = Router
