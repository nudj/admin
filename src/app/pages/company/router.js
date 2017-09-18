const express = require('express')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/:companySlug', respondWith(fetchers.get))
  router.put('/:companySlug', respondWith(fetchers.put))
  router.post('/:companySlug/hirers', respondWith(fetchers.postHirer))
  router.post('/:companySlug/hirers/:person', respondWith(fetchers.postHirerPerson))
  router.post('/:companySlug/surveys', respondWith(fetchers.postSurvey))
  router.patch('/:companySlug/surveys/:surveyId', respondWith(fetchers.patchSurvey))
  router.post('/:companySlug/tasks/:taskType', respondWith(fetchers.postTask))
  router.post('/:companySlug/jobs', respondWith(fetchers.postJob))

  return router
}

module.exports = Router
