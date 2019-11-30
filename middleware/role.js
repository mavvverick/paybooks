const error = require('http-errors')
const CError = require('../errors/cError')

const isAgent = (req, res, next) => {
  if (!req.user.isAgent) {
    return next(error(new CError({
      status: 404,
      message: 'Reserved for agents.',
      name: 'NotFound'
    })))
  }
  next()
}

const isUser = (req, res, next) => {
  if (req.user.isAgent) {
    return next(error(new CError({
      status: 404,
      message: 'Reserved for agents.',
      name: 'NotFound'
    })))
  }
  next()
}

module.exports = {
  isAgent,
  isUser
}
