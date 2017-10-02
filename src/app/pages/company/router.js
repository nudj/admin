const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/companies/:companySlug', respondWith(fetchers.get))
  router.putHandlers('/companies/:companySlug', respondWith(fetchers.put))
  router.postHandlers('/companies/:companySlug/hirers', respondWith(fetchers.postHirer))
  router.postHandlers('/companies/:companySlug/hirers/:person', respondWith(fetchers.postHirerPerson))
  router.postHandlers('/companies/:companySlug/surveys', respondWith(fetchers.postSurvey))
  router.patchHandlers('/companies/:companySlug/surveys/:surveyId', respondWith(fetchers.patchSurvey))
  router.postHandlers('/companies/:companySlug/tasks/:taskType', respondWith(fetchers.postTask))
  router.postHandlers('/companies/:companySlug/jobs', respondWith(fetchers.postJob))

  return router
}

module.exports = Router
