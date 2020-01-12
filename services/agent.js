const sql = require('../db/sql')
const rzp = require('../config/razorpay')
const error = require('http-errors')
const CError = require('../errors/cError')
const _resp = require('../lib/resp')
const api = require('../lib/bitla')
const tools = require('../utils/tools')
const bookModel = require('../db/mongo/bookings')
const cancelModel = require('../db/mongo/cancel')
const sendSms = require('../lib/sms')

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
          userId: req.user.userId,
          isAgent: true
        },
        transaction: t
      })
    }).then(data => {
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
  let pnr
  const finalAmount = req.data.totalAmount
  return sql.sequelize.transaction(t => {
    // busCreateData = _serializeBusData(req)
    return sql.User.findOne({
      where: {
        userId: req.user.userId,
        isAgent: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    }).then(userData => {
      // TODO add comission
      if (userData.amount < finalAmount) {
        throw Error('Low wallet balance')
      }
      userData.decrement({
        amount: finalAmount
      }, {
        transaction: t
      })
      const booking = tools.serializeBooking(req)
      const bookData = {
        ticket_status: 'INIT',
        total_fare: finalAmount,
        seatMeta: req.body.seats,
        seats: req.data.rawSeats,
        userId: req.user.userId,
        yolo_agent_comm_perct: req.data.agent_commission_perct
      }

      return bookModel.create(bookData).then(bookRecord => {
        return api('book', [req.body.sId, booking])
          .then(bookingData => {
            if (bookingData.hasOwnProperty('response')) {
              throw new CError({
                status: bookingData.response.code,
                message: 'Error while booking',
                name: 'BookinError'
              })
            }
            pnr = bookingData.result.ticket_details.pnr_number
            bookRecord.ticket_number = pnr
            bookRecord.save()
            return sql.Transaction.create({
              userId: req.user.userId,
              amount: finalAmount,
              fee: req.data.taxPercent,
              category: 'BOOK',
              orderId: pnr,
              status: 'DONE',
              type: 'DR'
            }, { transaction: t })
          })
      })
    })
  }).then(transaction => {
    return api('validate', pnr)
      .then(data => {
        if (data.hasOwnProperty('response')) {
          throw new CError({
            status: data.response.code,
            message: 'Error while confirming booking',
            name: 'BookinError'
          })
        }
        const details = data.result.ticket_details
        details.orderId = transaction.id
        details.paymentId = 'w911'

        return bookModel.findOneAndUpdate({
          userId: req.user.userId,
          ticket_number: pnr,
          ticket_status: 'INIT'
        }, details).then(bookRecord => {
          if (!bookRecord) {
            throw new CError({
              status: 404,
              message: 'No valid booking data ' +
                'contact support for further assistance',
              name: 'NotFound'
            })
          }
          return res.json(_resp(pnr))
        })
      })
  }).catch(err => {
    // Transaction has been rolled back
    next(error(err))
  })
}

function getWalletBalance (req, res, next) {
  return sql.User.findOne({
    attributes: ['amount', 'tokens', 'commPerct'],
    where: {
      userId: req.user.userId,
      isAgent: true
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

function cancel (req, res, next) {
  const seats = req.body.seats.split(',')
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
        })

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
            return sql.sequelize.transaction(t => {
              return sql.Transaction.create({
                userId: req.user.userId,
                orderId: req.body.ticket_number,
                category: 'CANCEL',
                status: 'DONE',
                type: 'CR'
              }, { transaction: t }).then(transaction => {
                return sql.User.update(
                  { amount: sql.Sequelize.literal(`amount + ${parseFloat(data.result.cancel_ticket.refund_amount)}`) },
                  {
                    where: {
                      userId: req.user.userId
                    },
                    transaction: t
                  }).then(rowUpdated => {
                  if (rowUpdated[0] === 0) {
                    throw Error(
                      'Error occured while adding money to wallet, contact support.'
                    )
                  }
                  return transaction
                })
              })
            })
          })
      }).then(data => {
        return res.json(_resp(req.body.ticket_number))
      }).catch(err => {
        return next(error(err))
      })
    })
}

module.exports = {
  initWallet,
  commit,
  initBooking,
  cancel,
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
