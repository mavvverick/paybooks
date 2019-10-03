const CError = require('../errors/cError')
const error = require('http-errors')
const sql = require('../db/sql')
const Op = sql.Sequelize.Op
const _resp = require('../lib/resp')
const rzp = require('../config/razorpay')

function cancel (req, res, next) {
  const seatList = req.body.seats.split(',')
  return sql.sequelize.transaction(function (t) {
    return sql.Booking.findOne({
      where: {
        id: req.body.bookId,
        userId: req.user.userId,
        status: 'DONE'
      },
      transaction: t
    }).then(booking => {
      if (!booking) {
        throw new CError({
          status: 404,
          message: 'No bookings available.',
          name: 'NotFound'
        })
      }

      if (Date.now() > (booking.maxCanTime * 1000)) {
        throw new CError({
          status: 410,
          message: 'Cancellation is not allowed after cancellation window.',
          name: 'Booking',
          code: 101
        })
      }

      return sql.Seat.findOne({
        attributes: [[sql.sequelize.fn('sum', sql.sequelize.col('fare')), 'total'],
          [sql.sequelize.fn('count', sql.sequelize.col('id')), 'count']],
        where: {
          bookId: req.body.bookId,
          seat: {
            [Op.in]: seatList
          },
          status: 'DONE'
        },
        group: ['bookId'],
        raw: true
      }, { transaction: t })
        .then(function (seatData) {
          return sql.Seat.update({ status: 'CANCEL' },
            {
              where: {
                bookId: req.body.bookId,
                seat: {
                  [Op.in]: seatList
                }
              },
              transaction: t
            }).then(function () {
            return booking.update({
              refund: sql.sequelize.literal(`refund + ${parseFloat(seatData.total)}`)
            }, { transaction: t }).then(data => {
              return [booking, seatData.total]
            })
          })
        })
    }).then(function (data) {
      const amntInPaise = data[1] * 100
      return rzp.payments.refund(data[0].paymentId, {
        amount: amntInPaise,
        notes: {
          userId: data[0].userId,
          bookId: data[0].id,
          seats: req.body.seats
        }
      }).then(data => {
        return sql.Refund.create({
          refundId: data.id
        }).then(refund => {
          // TODO notify BITLA
          return res.json(_resp(refund))
        })
      })
    }).catch(function (err) {
      t.rollback()
      return next(error(err))
    })
  }).catch(function (err) {
    return next(error(err))
  })
}

module.exports = {
  cancel
}
