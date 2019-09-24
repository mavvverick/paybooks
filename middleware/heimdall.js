'use strict'
const UnauthorizedError = require('../errors/UnauthorizedError')
const error = require('http-errors')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  if (
    req.url === '/v1/oauth/init') {
    return next()
  } else if (req.headers && req.headers.authorization) {
    // check token validity and next
    const parts = req.headers.authorization.split(' ')

    if (parts.length !== 2) {
      return next(new UnauthorizedError('credentials_bad_format', {
        message: 'Format is Authorization: Bearer [token]'
      }))
    }

    const scheme = parts[0]
    const credentials = parts[1]
    if (/^Bearer$/i.test(scheme)) {
      const token = credentials
      if (!token) {
        return next(new UnauthorizedError(
          'User access token empty'
        ))
      }

      return jwt.verify(token, process.env.TOKEN_SECRET, function (err, accessData) {
        if (accessData) {
          const payload = accessData.payload
          req.user.userId = payload.sub
          req.user.phNumber = payload.phNumber
          req.isAgent = payload.isAgent
          next()
        } else return next(error(401, err))
      })
    }
  } else throw new UnauthorizedError('No authorization token provided')
}

const dummyUser = (req, res, next) => {
  const users = [{
    userId: 'ANON1',
    phNumber: '98765643210',
    isAgent: false
  }, {
    userId: 'ANON2',
    phNumber: '9087654321',
    isAgent: true
  }]

  if (Object.keys(req.body).length > 0 && req.body.hasOwnProperty('userId')) {
    req.user = getUserById(req.body.userId)
    delete req.body.userId
  } else {
    req.user = users[0]
  };

  function getUserById (userId) {
    return users.filter(user => user.userId === userId)[0]
  }

  if (req.user) {
    next()
  } else {
    next(error(401, 'No user found'))
  }
}

module.exports = {
  auth,
  dummyUser
}
