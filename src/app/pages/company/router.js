const createRouter = require('@nudj/framework/router')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/:companySlug', respondWith(fetchers.get))
  router.putHandlers('/:companySlug', respondWith(fetchers.put))
  router.postHandlers('/:companySlug/hirers', respondWith(fetchers.postHirer))
  router.postHandlers('/:companySlug/hirers/:person', respondWith(fetchers.postHirerPerson))
  router.postHandlers('/:companySlug/surveys', respondWith(fetchers.postSurvey))
  router.patchHandlers('/:companySlug/surveys/:surveyId', respondWith(fetchers.patchSurvey))
  router.postHandlers('/:companySlug/tasks/:taskType', respondWith(fetchers.postTask))
  router.postHandlers('/:companySlug/jobs', respondWith(fetchers.postJob))

  return router
}

module.exports = Router
