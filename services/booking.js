const rzp = require('../config/razorpay')
const error = require('http-errors')
const sql = require('../db/sql')
const _resp = require('../lib/resp')

async function intiBooking (req, res, next) {
  return sql.sequelize.transaction(function (t) {
    // TODO get bitla booking data
    const busCreateData = _serializeBusData(req)
    return sql.Booking.create(busCreateData,
      { transaction: t }).then(function (booking) {
      const seats = _serializeSeatData(req, booking)
      return sql.Seat.bulkCreate(
        seats, { transaction: t }
      ).then(data => {
        return rzp.orders.create({
          amount: booking.totalFare,
          currency: 'INR',
          receipt: booking.id,
          payment_capture: 1,
          notes: {
            user: booking.userId
          }
        })
      }).catch(err => {
        throw err
      })
    }).then(rzpRecord => {
      sql.Booking.update({
        orderId: rzpRecord.id
      }, { where: { id: parseInt(rzpRecord.receipt) } })
      return res.json(_resp(rzpRecord))
    }).catch(err => {
      if (err.errors[0].message === 'seats_seat_day must be unique') {
        return next(error(Error('Seat not available')))
      }
      next(error(err))
    })
  })
}

function commitBooking (req, res, next) {
  // const validate = rzp.ValidateOrder(req.body.data)
  const update = {
    paymentId: req.body.data.paymentId,
    status: 'DONE'
  }

  // if (!validate) {
  //   throw Error('Payment data can not be validated, contact support')
  // }

  return sql.sequelize.transaction(function (t) {
    return sql.Booking.update(
      update,
      {
        where: {
          bookId: req.body.data.orderId,
          userId: req.body.data.userId
        },
        transaction: t
      }).then(data => {
      return sql.Seat.update(
        {
          status: 'DONE'
        },
        {
          where: {
            bookId: req.body.data.orderId
          },
          transaction: t
        }).then(data => {
        return res.json(_resp('OK'))
      }).catch(err => {
        t.rollback()
        throw err
      })
      // if agent then add comission
    })
  }).catch(err => {
    return next(error(err))
  })
}

module.exports = {
  intiBooking,
  commitBooking
}

function _serializeBusData (req) {
  const bookingDateTime = req.body.date + ' ' + req.body.bPoint
  const maxCanTime = getUnixTime(bookingDateTime)
  return {
    userId: req.user.userId,
    mob: req.body.mob,
    bId: req.bus.bId,
    rId: req.bus.rId,
    totalFare: req.finalAmnt || req.bus.maxfr,
    dst: req.discount || 0,
    frm: req.bus.frm,
    whr: req.bus.whr,
    bPoint: req.board.name,
    dPoint: req.drop.name,
    bTime: req.board.eta,
    dTime: req.drop.eta,
    maxCanTime: maxCanTime + (Date.now() / 1000)
  }
}

function _serializeSeatData (req, bookingData) {
  const bookTime = (Date.now() / 1000) + 10 * 60

  return req.body.bookings.map(booking => {
    return {
      name: booking.name,
      day: getUnixTime(req.body.date),
      seat: booking.seat,
      bookId: bookingData.id,
      bId: bookingData.bId,
      bookTime: bookTime,
      fare: req.bus.maxfr
    }
  })
}

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
}
