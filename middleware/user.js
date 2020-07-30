
const error = require('http-errors')
const userId = (req, res, next) => {
  if (req.method !== 'POST') {
    return next(error(404, 'Middleware must be used with post request'))
  }
  if (req.baseUrl === '/v1/wallets' && req.body.hasOwnProperty('gateway')) {
    req.body.transactionId = req.params.transactionId
  }
  req.body.userId = req.params.userId
  return next()
}

module.exports = userId
