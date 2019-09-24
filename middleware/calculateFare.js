const error = require('http-errors')
const CError = require('../errors/cError')

const data = (req, res, next) => {
  next()
}

module.exports = data
