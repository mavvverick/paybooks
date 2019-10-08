const rzp = require('../config/razorpay')
const error = require('http-errors')
const CError = require('../errors/cError')
const sql = require('../db/sql')
const _resp = require('../lib/resp')

async function intiBooking (req, res, next) {
  let busCreateData, seats, bookingData
  return sql.sequelize.transaction(t => {
    busCreateData = _serializeBusData(req)
    return sql.Booking.create(busCreateData,
      { transaction: t }).then(booking => {
      bookingData = booking
      seats = _serializeSeatData(req, booking)
      return sql.Seat.create(seats[0],
        { transaction: t })
    })
  }).then(result => {
    // Transaction has been committed
    return rzp.orders.create({
      amount: bookingData.fare * 100,
      currency: 'INR',
      receipt: bookingData.id,
      payment_capture: 1,
      notes: {
        user: bookingData.userId
      }
    }).then(rzpRecord => {
      bookingData.orderId = rzpRecord.id
      bookingData.save()
      return res.json(_resp(rzpRecord))
    })
  }).catch(err => {
    // Transaction has been rolled back
    if (err.name === 'SequelizeUniqueConstraintError') {
      if (err.errors[0].message === 'seats_seat_day must be unique') {
        return next(error(Error('Seat not available')))
      }
    }
    next(error(err))
  })
}

function commitBooking (req, res, next) {
  const validate = rzp.ValidateOrder(req.body.data)
  const update = {
    paymentId: req.body.data.paymentId,
    status: 'DONE'
  }

  if (!validate) {
    throw Error('Payment data can not be validated, contact support')
  }

  const bookId = parseInt(req.body.data.bookId)

  return sql.sequelize.transaction(function (t) {
    return sql.Booking.update(
      update,
      {
        where: {
          id: bookId,
          userId: req.user.userId,
          status: 'INIT'
        },
        transaction: t
      }).then(data => {
      if (data[0] === 0) {
        throw new CError({
          status: 404,
          message: 'No booking found.',
          name: 'NotFound'
        })
      }

      return sql.Seat.update(
        {
          status: 'DONE'
        },
        {
          where: {
            bookId: bookId
          },
          transaction: t
        }).then(data => {
        return res.json(_resp('OK'))
      }).catch(err => {
        t.rollback()
        throw err
      })
      // TODO if agent then add comission
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
  const day = getUnixTime(req.body.date)
  if (day < (Date.now() / 1000)) {
    throw new CError({
      status: 404,
      message: 'Booking date cannot be less than current date.',
      name: 'NotFound'
    })
  }

  const busData = {
    frm: req.bus.frm,
    whr: req.bus.whr,
    bPoint: req.bus.pick,
    dPoint: req.bus.drop
  }

  return {
    userId: req.user.userId,
    mob: req.body.mob,
    bId: req.bus.bId,
    rId: req.bus.rId,
    day: day,
    maxCanTime: maxCanTime + (Date.now() / 1000),
    fare: req.deck.finalAmount,
    disc: req.deck.disc,
    bus: JSON.stringify(busData)
  }
}

function _serializeSeatData (req, bookingData) {
  const bookTime = (Date.now() / 1000)
  return req.deck.config.bookedSeats.map(seat => {
    return {
      name: seat.typ,
      day: getUnixTime(req.body.date),
      seat: seat.num,
      bookId: bookingData.id,
      bId: bookingData.bId,
      bookTime: bookTime,
      fare: seat.price,
      rId: req.bus.rId
    }
  })
}

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
}
