const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/companies/:companySlug/messages/:surveyMessageId', respondWith(fetchers.get))

  return router
}

module.exports = Router
