const CError = require('../errors/cError')
const sql = require('../db/sql')
const Op = sql.Sequelize.Op
const error = require('http-errors')
const _resp = require('../lib/resp')
const sendSms = require('../lib/sms')
const bus = require('../db/mongo/bus')

function getProfile (req, res, next) {
  return res.json(_resp(req.user))
}

function getMyBookings (req, res, next) {
  let status = null
  switch (req.query.filter) {
    case 'all':
      status = ['DONE', 'PENDING', 'CANCEL', 'FAILED']
      break
    case 'pending':
      status = ['PENDING']
      break
    case 'cancel':
      status = ['CANCEL']
      break
    case 'failed':
      status = ['FAILED']
      break
    default:
      status = ['DONE', 'PENDING', 'CANCEL', 'FAILED']
  }
  return sql.Booking.findAll({
    attributes: {
      exclude: ['deletedAt', 'updatedAt']
    },
    where: {
      userId: req.user.userId,
      status: { [Op.in]: status }
    }
  }).then(bookings => {
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
  return sql.Booking.findOne({
    attributes: {
      exclude: ['deletedAt', 'updatedAt']
    },
    where: {
      id: req.params.bookId,
      userId: req.user.userId
    }
  }).then(booking => {
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
  return sql.Booking.findOne({
    where: {
      id: req.body.bookId,
      status: 'DONE',
      userId: req.user.userId
    }
  }).then(booking => {
    if (!booking) {
      throw new CError({
        status: 404,
        message: 'No active bookings available.',
        name: 'NotFound'
      })
    }

    const day = new Date(booking.day * 1000)
    const busData = JSON.parse(booking.bus)
    const journeyDetails = busData.frm + ' To ' + busData.whr
    const dateString = day.getDate() + '-' + (day.getMonth() + 1) + '-' + day.getFullYear()
    const pnr = booking.orderId.split('order_')[1]
    const msg = `YoloBus:${booking.bId},${journeyDetails} PNR:${pnr},DOJ:${dateString},Time:${busData.bPoint.eta},seats:${booking.seats}`
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
  return bus.updateOne({
    bId: req.body.bId
  }, {
    $inc: { 'rating.num': req.body.rating, 'rating.users': 1 }
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

module.exports = {
  getProfile,
  getMyBookings,
  getBookingById,
  sendTicket,
  updateProfile,
  rating,
  refunds
}
