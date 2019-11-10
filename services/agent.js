const sql = require('../db/sql')
const rzp = require('../config/razorpay')
const error = require('http-errors')
const CError = require('../errors/cError')
const _resp = require('../lib/resp')

function initWallet (req, res, next) {
  let tranInst
  return sql.sequelize.transaction(t => {
    return sql.Transaction.create({
      userId: req.user.userId,
      amount: req.body.amount,
      type: 'CR'
    }, {
      transaction: t
    }).then(transaction => {
      tranInst = transaction
      return rzp.orders.create({
        amount: transaction.amount * 100,
        currency: 'INR',
        receipt: transaction.id,
        payment_capture: 1,
        notes: {
          user: transaction.userId
        }
      })
    })
  }).then(rzpRecord => {
    console.log(rzpRecord)
    tranInst.orderId = rzpRecord.id
    tranInst.save()
    res.json(_resp(rzpRecord))
  }).catch(err => {
    next(error(err))
  })
}

function commit (req, res, next) {
  const validate = rzp.ValidateOrder(req.body.data)
  if (!validate) {
    throw Error('Payment data can not be validated, contact support')
  }
  let tranInst
  return sql.sequelize.transaction(function (t) {
    return sql.Transaction.findOne(
      {
        where: {
          id: req.body.data.bookId,
          userId: req.user.userId,
          status: 'INIT'
        },
        lock: t.LOCK.UPDATE,
        transaction: t
      }).then(transactionRecord => {
      tranInst = transactionRecord
      if (!transactionRecord) {
        throw new CError({
          status: 404,
          message: 'No transaction found.',
          name: 'NotFound'
        })
      }

      return sql.User.update({
        amount: sql.Sequelize.literal(`amount + ${parseFloat(tranInst.amount)}`)
      }, {
        where: {
          userId: req.user.userId
        },
        transaction: t
      })
    }).then(data => {
      console.log(data)
      if (data[0] === 1) {
        tranInst.status = 'DONE'
        tranInst.paymentId = req.body.data.paymentId
        tranInst.save()
        return res.json(_resp('OK'))
      }

      throw new CError({
        status: 404,
        message: 'Error in transaction.',
        name: 'NotFound'
      })
    }).catch(err => {
      return next(error(err))
    })
  })
}

function initBooking (req, res, next) {
  let seats, bookingData
  return sql.sequelize.transaction(t => {
    // busCreateData = _serializeBusData(req)
    return sql.User.findOne({
      where: {
        userId: req.user.userId
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    }).then(userData => {
      // TODO add comission
      if (userData.amount <= req.deck.finalAmount) {
        throw Error('Low wallet balance')
      }

      userData.decrement({
        amount: req.deck.finalAmount
      }, {
        transaction: t
      })
      req.busSerializedData.status = 'DONE'
      return sql.Booking.create(req.busSerializedData,
        { transaction: t }).then(booking => {
        bookingData = booking
        return sql.Transaction.create({
          userId: req.user.userId,
          orderId: booking.id,
          status: 'DONE',
          type: 'DR'
        }, { transaction: t }).then(transaction => {
          seats = _serializeSeatData(req, booking)
          return sql.Seat.bulkCreate(seats,
            { transaction: t })
        })
      })
    })
  }).then(result => {
    return res.json(_resp(result))
  }).catch(err => {
    // Transaction has been rolled back
    if (err.name === 'SequelizeUniqueConstraintError') {
      if (err.errors[0].type === 'unique violation') {
        return next(error(Error('Seat not available')))
      }
    }
    next(error(err))
  })
}

function getWalletBalance (req, res, next) {
  return sql.User.findOne({
    attributes: ['amount'],
    where: {
      userId: req.user.userId
    }
  }).then(user => {
    if (!user) {
      throw new CError({
        status: 404,
        message: 'No user found.',
        name: 'NotFound'
      })
    }
    res.json(_resp(user))
  })
}

module.exports = {
  initWallet,
  commit,
  initBooking,
  getWalletBalance
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
      rId: req.bus.rId,
      status: 'DONE'
    }
  })
}

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
}
