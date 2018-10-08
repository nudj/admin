const createRouter = require('@nudj/framework/router')

const generateRouterFor = ({
  fetchers,
  plural
}) => ({
  ensureLoggedIn,
  respondWith,
  respondWithGql
}) => {
  const router = createRouter()

  if (fetchers.getMany) {
    router.getHandlers(`/${plural}`, ensureLoggedIn, respondWithGql(fetchers.getMany))
  }
  if (fetchers.getOne) {
    router.getHandlers(`/${plural}/:id`, ensureLoggedIn, respondWithGql(fetchers.getOne))
  }
  if (fetchers.getNew) {
    router.getHandlers(`/${plural}/:id/new`, ensureLoggedIn, respondWithGql(fetchers.getNew))
  }
  if (fetchers.postNew) {
    router.postHandlers(`/${plural}/:id/new`, ensureLoggedIn, respondWithGql(fetchers.postNew))
  }
  if (fetchers.getEdit) {
    router.getHandlers(`/${plural}/:id/edit`, ensureLoggedIn, respondWithGql(fetchers.getEdit))
  }
  if (fetchers.putEdit) {
    router.putHandlers(`/${plural}/:id/edit`, ensureLoggedIn, respondWithGql(fetchers.putEdit))
  }

  return router
}

module.exports = generateRouterFor
