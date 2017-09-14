const express = require('express')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/people/:personId', respondWith(fetchers.get))
  router.put('/people/:personId', respondWith(fetchers.put))
  router.post('/people/:personId/referrals/:jobSlug', respondWith(fetchers.postReferral))
  router.post('/people/:personId/recommendations/:jobSlug', respondWith(fetchers.postRecommendation))
  router.post('/people/:personId/tasks/:taskType', respondWith(fetchers.postTask))

  return router
}

module.exports = Router
