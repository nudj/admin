const http = require('http')
const jsonServer = require('json-server')
const enableDestroy = require('server-destroy')
const rewrite = require('express-urlrewrite')

const find = require('lodash/find')
const merge = require('lodash/merge')
const format = require('date-fns/format')

const dummyData = require('./dummy-data')

class MockApi {
  constructor ({jsonServer, dummyData}) {
    this.serverUp = false
    this.dummyData = dummyData
  }

  injectDummyData () {
    this.router = jsonServer.router(merge({}, this.dummyData))
  }

  injectDate ({req, res, next}) {
    const dateNow = format(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')

    if (req.method === 'POST') {
      merge(req.body, {
        created: dateNow,
        modified: dateNow
      })
    } else if (req.method === 'PATCH') {
      merge(req.body, {
        modified: dateNow
      })
    }

    next()
  }

  getFirstOfType ({req, res, next}) {
    let type = req.params.type
    let match = find(this.dummyData[type], req.query)
    if (match) {
      res.json(match)
    } else {
      res.json({
        error: true,
        code: 404,
        errorMessage: 'no match'
      })
    }
  }

  listen (port, callback) {
    if (!this.serverUp) {
      this.start()
    }

    this.port = port
    this.callback = callback

    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.port, (error) => {
        if (error) {
          return reject(error)
        }
        enableDestroy(this.httpServer)
        resolve(this.callback())
      })
    })
  }

  start () {
    const middlewares = jsonServer.defaults()

    this.server = jsonServer.create()
    this.httpServer = http.createServer(this.server)

    this.server.use(middlewares)

    this.injectDummyData()

    this.server.get('/:type/filter', rewrite('/:type'))
    this.server.get('/:type/first', (req, res, next) => this.getFirstOfType({req, res, next}))

    this.server.get('/restart-mock-api', (req, res, next) => this.restartHandler({req, res, next}))

    this.server.use(jsonServer.bodyParser)
    this.server.use((req, res, next) => this.injectDate({req, res, next}))

    this.server.use(this.router)
    this.serverUp = true
  }

  close () {
    this.serverUp = false
    return new Promise((resolve, reject) => {
      return this.httpServer.destroy(error => error ? reject(error) : resolve())
    })
  }

  restart () {
    return this.close()
      .then(() => this.listen(this.port, this.callback))
  }

  restartHandler ({req, res, next}) {
    process.nextTick(() => {
      this.restart()
        .catch(error => console.error(error))
    })

    const message = 'Restarting on next tick - bye! 👋🏼'

    console.log(message)
    res.send(message)
  }
}

const api = new MockApi({jsonServer, dummyData})

module.exports = {
  listen: api.listen.bind(api),
  restart: api.restart.bind(api),
  start: api.start.bind(api)
}
