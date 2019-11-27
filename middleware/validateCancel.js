const CError = require('../errors/cError')
const error = require('http-errors')
const api = require('../lib/bitla')

function validate (req, res, next) {
  req.data = {}
  req.data.str = `?ticket_number=${req.body.ticket_number}&seat_numbers=${req.body.seats}`
  return api('canCancel', req.data.str).then(cancelData => {
    if (cancelData.hasOwnProperty('response')) {
      throw new CError({
        code: cancelData.response.code,
        status: 404,
        message: cancelData.response.message,
        name: 'CancelError'
      })
    }
    return next()
  }).catch(err => {
    return next(error(err))
  })
}

module.exports = validate
