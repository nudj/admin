const express = require('express')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/people', respondWith(fetchers.get))
  router.post('/people', respondWith(fetchers.post))

  return router
}

module.exports = Router
