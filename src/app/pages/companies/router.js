const createRouter = require('@nudj/framework/router')
const { LogThenRedirect } = require('@nudj/framework/errors')

const fetchers = require('./fetchers')

const Router = ({
  ensureLoggedIn,
  respondWithGql
}) => {
  const router = createRouter()
  router.use(ensureLoggedIn)

  router.getHandlers('/', respondWithGql(fetchers.get))
  router.postHandlers('/', respondWithGql(fetchers.post))
  router.getHandlers('/companies', (req, res, next) => {
    next(new LogThenRedirect('Cannot access this url directly', '/', req.originalUrl))
  })

  return router
}

module.exports = Router
