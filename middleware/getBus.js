const cache = require('../lib/cache')
const CError = require('../errors/cError')
const error = require('http-errors')
const busModel = require('../db/mongo/bus')

function getBusData (req, res, next) {
  return cache.getBusDetails(req.body.bId)
    .then(busDetails => {
      if (!busDetails) {
        return busModel.findOne({
          bId: req.body.bId
        }).lean().then(busDetails => {
          if (!busDetails) {
            return next(error(new CError({
              status: 404,
              message: 'No bus data found.',
              name: 'NotFound'
            })))
          }
          cache.setBusDetails(req.body.bId, busDetails)
          req.bus = busDetails
          req.busSerializedData = _serializeBusData(req)
          // filterboardingData(req)
          return next()
        }).catch(err => {
          next(error(err))
        })
      }
      req.bus = busDetails
      req.busSerializedData = _serializeBusData(req)
      // filterboardingData(req)
      return next()
    }).catch(err => {
      next(error(err))
    })
}

module.exports = getBusData

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
    seats: req.body.seats,
    day: day,
    maxCanTime: maxCanTime + (Date.now() / 1000),
    bus: JSON.stringify(busData)
  }
}

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
}
