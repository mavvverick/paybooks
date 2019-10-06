const CError = require('../errors/cError')
const sql = require('../db/sql')
const error = require('http-errors')
const _resp = require('../lib/resp')
const sendSms = require('../lib/sms')
const bus = require('../db/mongo/bus')

function getProfile (req, res, next) {
  return res.json(_resp(req.user))
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

    res.json(_resp(bookings))
  }).catch(err => {
    next(error(err))
  })
}

function sendTicket (req, res, next) {
  return sql.Booking.findOne({
    id: req.body.bookId
  }).then(booking => {
    if (!booking) {
      throw new CError({
        status: 404,
        message: 'No bookings available.',
        name: 'NotFound'
      })
    }
    const day = new Date(booking.day)
    const msg = `PNR: ${booking.id}, ${day}.`
    // TODO ticket url
    // TODO ticket message format
    // `PNR: ${booking.id},Bus:15609,DOJ:22-06-2014,TIME:22:00,3A,GHY TO ROK,RAJAN,B1 35,FARE:1670,SC:22.47+PG CHGS.`
    return sendSms(req.user.phNumber, msg)
      .catch(err => {
        throw err
      })
  }).catch(err => {
    next(error(err))
  })
}

function rating (req, res, next) {
  return bus.updateOne({
    bId: req.body.bId
  }, {
    $inc: { rating: 1 }
  }).then(data => {
    res.json('OK')
  }).catch(err => {
    next(error(err))
  })
}

function updateProfile (req, res, next) {

}

module.exports = {
  getProfile,
  getMyBookings,
  sendTicket,
  updateProfile,
  rating
}
