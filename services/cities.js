const error = require('http-errors')
const resp = require('../lib/resp')
const sql = require('../db/sql')
const lruCache = require('../config/lruCache')

function cities (req, res, next) {
  if (lruCache.peek('cities')) {
    return res.json(resp(lruCache.get('cities')))
  }

  sql.City.findAll({
    attributes: ['id', 'name', 'code']
  }).then(cities => {
    lruCache.set('cities', cities)
    return res.json(resp(cities))
  }).catch(err => {
    return next(error(err))
  })
}

module.exports = {
  cities
}
