const CError = require('../errors/cError')
const sql = require('../db/sql')
const error = require('http-errors')
const _resp = require('../lib/resp')
const sendSms = require('../lib/sms')
const reviewModel = require('../db/mongo/review')
const bookModel = require('../db/mongo/bookings')
const bookParams = require('../utils/bookschema')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function getProfile (req, res, next) {
  return res.json(_resp(req.user))
}

function getMyBookings (req, res, next) {
  return bookModel.find({
    userId: req.user.userId
  }).select(bookParams).then(bookings => {
    if (bookings.length < 1) {
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

function getBookingById (req, res, next) {
  return bookModel.find({
    ticket_number: req.params.bookId,
    userId: req.user.userId
  }).select(bookParams)
    .then(booking => {
      if (!booking) {
        return next(error(new CError({
          status: 404,
          message: 'No booking available.',
          name: 'NotFound'
        })))
      }
      res.json(_resp(booking))
    }).catch(err => {
      next(error(err))
    })
}

function sendTicket (req, res, next) {
  return bookModel.findOne({
    ticket_number: req.body.bookId,
    userId: req.user.userId
  }).select(bookParams)
    .then(booking => {
      if (!booking) {
        throw new CError({
          status: 404,
          message: 'No active bookings available.',
          name: 'NotFound'
        })
      }
      const day = new Date(booking.travel_date)
      const journeyDetails = booking.origin + ' To ' + booking.destination
      const dateString = day.getDate() + '-' + (day.getMonth() + 1) + '-' + day.getFullYear()
      const msg = `YoloBus:${booking.ticket_number},${journeyDetails} PNR:YO-${booking.operator_pnr},DOJ:${dateString},Time:${booking.dep_time},seats:${booking.seat_numbers}`

      if (booking.passenger_detail.email) {
        sendEmail(booking.passenger_detail.email, booking.ticket_number, msg)
      }

      // TODO ticket url
      // TODO ticket message format
      // `PNR: ${pnr},Bus:15609,DOJ:22-06-2014,TIME:22:00,3A,GHY TO ROK,RAJAN,B1 35,FARE:1670,SC:22.47+PG CHGS.`
      sendSms(req.user.phNumber, msg)
        .catch(err => {
          throw err
        })
      res.json(_resp('OK'))
    }).catch(err => {
      next(error(err))
    })
}

function rating (req, res, next) {
  return reviewModel.create({
    sId: req.body.bId,
    user: req.user.userId,
    cmnt: req.body.comment,
    rt: req.body.rating
  }).then(data => {
    res.json(_resp('OK'))
  }).catch(err => {
    next(error(err))
  })
}

function refunds (req, res, next) {
  return sql.Refund.findAll({
    attributes: {
      exclude: ['deletedAt', 'updatedAt']
    },
    where: {
      userId: req.user.userId
    }
  }).then(refunds => {
    if (refunds.length < 1) {
      return next(error(new CError({
        status: 404,
        message: 'No refunds available.',
        name: 'NotFound'
      })))
    }

    res.json(_resp(refunds))
  }).catch(err => {
    next(error(err))
  })
}

function updateProfile (req, res, next) {

}

function sendEmail (email, pnr, txt) {
  const msg = {
    to: email, // receiver's email
    from: 'support@yolobus.in', // sender's email
    subject: `Confirmation Booking for PNR ${pnr}`, // Subject
    text: txt // content
    // html: 'and easy to do anywhere, even with Node.js'// HTML content
  }
  sgMail.send(msg)
}

module.exports = {
  getProfile,
  getMyBookings,
  getBookingById,
  sendTicket,
  updateProfile,
  rating,
  refunds
}
