const express = require('express')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/:companySlug/messages/:surveyMessageId', respondWith(fetchers.get))

  return router
}

module.exports = Router
