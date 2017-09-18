const express = require('express')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = express.Router()
  router.use(ensureLoggedIn)

  router.get('*', respondWith(() => ({})))

  return router
}

module.exports = Router
