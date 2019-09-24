const CError = require('../errors/cError')
const sql = require('../db/sql')
const error = require('http-errors')

function getProfile (req, res, next) {
  return res.json(req.user)
}

function getMyBookings (req, res, next) {
  let status = null
  switch (req.params.filter) {
    case 'ALL':
      status = ['DONE', 'PENDING', 'CANCEL', 'FAILED']
      break
    case 'PENDING':
      status = ['PENDING']
      break
    case 'CANCEL':
      status = ['CANCEL']
      break
    case 'FAILED':
      status = ['FAILED']
  }

  return sql.Booking.findAll({
    where: {
      userId: req.user.userId,
      status: { $in: status }
    }
  }).then(bookings => {
    if (!bookings) {
      return next(error(new CError({
        status: 404,
        message: 'No bookings available.',
        name: 'NotFound'
      })))
    }

    res.json(bookings)
  }).catch(err => {
    next(error(err))
  })
}

function sendTicket (req, res, next) {
  // send ticket url with code in sms
}

function updateProfile (req, res, next) {

}

module.exports = {
  getProfile,
  getMyBookings,
  sendTicket,
  updateProfile
}
