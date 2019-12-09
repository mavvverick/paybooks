const error = require('http-errors')
const CError = require('../errors/cError')
const resp = require('../lib/resp')
const sql = require('../db/sql')
const lruCache = require('../config/lruCache')

function Routes (req, res, next) {
  const routeKey = req.body.frm + ':' + req.body.whr

  if (lruCache.peek('rotues')) {
    const routeData = lruCache.get('rotues')
    if (routeData[routeKey] === undefined) {
      return next(error(new CError({
        status: 404,
        message: 'This route is not serviceable.',
        name: 'NotFound'
      })))
    }

    req.rId = routeData[routeKey]
    return next()
  }

  sql.Route.findAll({
  }).then(rotues => {
    const routeData = {}
    rotues.forEach(route => {
      const key = route.frm + ':' + route.whr
      routeData[key] = route.id
    })
    lruCache.set('rotues', routeData)

    if (routeData[routeKey] === undefined) {
      return next(error(new CError({
        status: 404,
        message: 'This route is not serviceable.',
        name: 'NotFound'
      })))
    }

    req.rId = routeData[routeKey]
    next()
  }).catch(err => {
    return next(error(err))
  })
}

module.exports = Routes
