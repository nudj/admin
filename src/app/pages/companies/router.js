const createRouter = require('@nudj/framework/router')
const { LogThenRedirect } = require('@nudj/framework/errors')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWith
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/', respondWith(fetchers.get))
  router.postHandlers('/', respondWith(fetchers.post))
  router.getHandlers('/companies', (req, res, next) => {
    next(new LogThenRedirect('Cannot access this url directly', '/', req.originalUrl))
  })

  return router
}

module.exports = Router
