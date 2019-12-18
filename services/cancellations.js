const CError = require('../errors/cError')
const error = require('http-errors')
const _resp = require('../lib/resp')
const rzp = require('../config/razorpay')
const api = require('../lib/bitla')
const bookModel = require('../db/mongo/bookings')
const cancelModel = require('../db/mongo/cancel')
const sendSms = require('../lib/sms')

function canCancel (req, res, next) {
  const str = `?ticket_number=${req.query.ticket_number}&seat_numbers=${req.query.seat_numbers}`
  return api('canCancel', str).then(data => {
    return res.json(_resp(data))
  }).catch(err => {
    return next(error(err))
  })
}

function cancel (req, res, next) {
  const seats = req.body.seats.split(',')
  let seatCount = 0
  return api('cancel', req.data.str)
    .then(data => {
      if (data.hasOwnProperty('response')) {
        throw new CError({
          code: data.response.code,
          status: 404,
          message: 'Error while cancellations',
          name: 'CancelError'
        })
      }

      return bookModel.findOne({
        userId: req.user.userId,
        ticket_number: req.body.ticket_number,
        seats: { $all: seats }
      }).then(booking => {
        if (!booking) {
          return next(error(new CError({
            status: 404,
            message: 'No booking found.',
            name: 'NotFound'
          })))
        }

        booking.seat_fare_details.forEach(seatData => {
          if (seats.indexOf(seatData.seat_detail.seat_number) !== -1) {
            seatData.seat_detail.status = 'CANCEL'
          }

          if (seatData.seat_detail.status !== 'CANCEL') {
            seatCount += 1
          }
        })
        if (seatCount === 0) {
          booking.ticket_status = 'CANCEL'
        }

        booking.save()
        data.result.cancel_ticket.ticket_number = req.body.ticket_number
        data.result.cancel_ticket.reason = req.body.reason

        return cancelModel.create(data.result.cancel_ticket)
          .then(cancelRecords => {
            const msg = `YoloBus: cancellation request scuccessful for seats: ${req.body.seats} against ticket number ${booking.ticket_number}`
            sendSms(booking.passenger_details.mobile, msg)
              .catch(err => {
                throw err
              })
            const amntInPaise = parseFloat(data.result.cancel_ticket.refund_amount) * 100
            return rzp.payments.refund(booking.paymentId, {
              amount: amntInPaise,
              notes: {
                userId: booking.userId,
                bookId: booking.ticket_number,
                seats: req.body.seats
              }
            })
          })
      }).then(data => {
        return res.json(_resp(req.body.ticket_number))
      })
    }).catch(err => {
      return next(error(err))
    })
}

module.exports = {
  cancel
}
