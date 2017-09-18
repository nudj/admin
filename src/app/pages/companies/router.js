const express = require('express')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('/', respondWith(fetchers.get))
  router.post('/', respondWith(fetchers.post))

  return router
}

module.exports = Router
