const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/companies/:companySlug', respondWithGql(fetchers.get))
  router.putHandlers('/companies/:companySlug', respondWithGql(fetchers.put))
  router.postHandlers('/companies/:companySlug/hirers', respondWith(fetchers.postHirer))
  router.postHandlers('/companies/:companySlug/hirers/:person', respondWith(fetchers.postHirerPerson))
  router.postHandlers('/companies/:companySlug/jobs', respondWithGql(fetchers.postJob))

  return router
}

module.exports = Router
