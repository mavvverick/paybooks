const bus = require('../db/mongo/bus')
const sql = require('../db/sql')
const Op = sql.Sequelize.Op
const CError = require('../errors/cError')
const error = require('http-errors')
const _resp = require('../lib/resp')

function search (req, res, next) {
  const date = new Date(req.body.date)
  const dayOfWeek = date.getDay()

  const query = {
    frm: req.body.frm,
    whr: req.body.whr,
    nonOpDays: { $nin: [dayOfWeek] },
    $and: []
  }

  const buses = _getBuses(query)
  const bookings = _getBookings({ rId: `${req.body.frm}-${req.body.whr}` }, date)
  // TODO bitlaData = _getDataFromBitlaApi()
  Promise.all([buses, bookings]).then(function (values) {
    const data = {
      busData: values[0],
      bookingData: values[1]
    }

    if (data.busData[0].length < 1) {
      throw new CError({
        status: 404,
        message: 'No bus found for this route',
        name: 'Search',
        code: 101
      })
    }

    return res.json(_resp(data))
  }).catch(err => {
    return next(error(err))
  })

  function _getBuses (query) {
    const timeConf = {
      a: { gte: 0, lte: 600 },
      b: { gte: 600, lte: 1200 },
      c: { gte: 1200, lte: 1800 },
      d: { gte: 1800, lte: 2400 }
    }

    const dtimes = []
    const atimes = []
    const bc = []
    const amnt = []

    if (req.body.hasOwnProperty('dTimes')) {
      req.body.dTimes.split(',').forEach(interval => {
        dtimes.push({ dt: timeConf[interval] })
      })

      query.$and.push({ $or: dtimes })
    }

    if (req.body.hasOwnProperty('aTimes')) {
      req.body.aTimes.split(',').forEach(interval => {
        atimes.push({ at: timeConf[interval] })
      })
      query.$and.push({ $or: atimes })
    }

    if (req.body.hasOwnProperty('bc')) {
      req.body.bc.split(',').forEach(cat => {
        const dd = {}
        const key = 'bc.' + cat
        dd[key] = true
        bc.push(dd)
      })
      query.$and.push({ $and: bc })
    }

    if (req.body.hasOwnProperty('amenities')) {
      query.$and.push({ amnt: { $all: req.body.amenities.split(',') } })
    }

    if (query.$and.length < 1) {
      delete query.$and
    }

    return bus.find(query)
  }
}

async function getSeatDetails (req, res, next) {
  // TODO let bitla
  const bookings = await _getBookingsByBus(req.query.bId, req.query.date)
  // TODO get seat layout data
  Promise.all([bookings]).then(function (values) {
    const data = {
      booking: values[0]
    }

    if (values[0].length < 1) {
      throw new CError({
        status: 404,
        message: 'No bus found for this route',
        name: 'Search',
        code: 101
      })
    }

    return res.json(_resp(data))
  }).catch(err => {
    console.log(err)
  })
}

function getOffers (req, res, next) {
  // return offers.
}

module.exports = {
  search,
  getOffers,
  getSeatDetails
}

function _getBookings (where, date) {
  where.day = getUnixTime(date)
  where.status = { [Op.in]: ['INIT', 'PENDING', 'DONE'] }

  return sql.Seat.count({
    where: where,
    group: ['bId']
  })
}

function _getBookingsByBus (bId, date) {
  const where = {
    bId: bId
  }
  where.day = getUnixTime(date)
  where.status = { [Op.in]: ['INIT', 'PENDING', 'DONE'] }
  return sql.Booking.findAll({
    attributes: ['seat'],
    where: where
  }).catch(err => {
    console.log(err)
  })
}

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
}
