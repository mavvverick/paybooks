const cache = require('../lib/cache')
const CError = require('../errors/cError')
const error = require('http-errors')
const scheduleModel = require('../db/mongo/schedule')
const api = require('../lib/bitla')

function getSchedule (req, res, next) {
  const params = {
    bus_layout: 1,
    travel_date: 1,
    origin_id: 1,
    destination_id: 1,
    service_tax_percent: 1
  }
  req.data = {}
  req.data.seats = req.body.seats.split(',')
  req.data.totalAmount = 0
  req.data.validSeats = []
  req.data.rawSeats = []
  const timeOffset = new Date()
  timeOffset.setHours(5, 29, 0)
  return scheduleModel.findOne({
    id: req.body.sId,
    travel_date: { $gte: timeOffset }
  }).select(params).lean().then(busDetails => {
    if (!busDetails) {
      throw new CError({
        status: 404,
        message: 'NO bus found',
        name: 'NotFound'
      })
    }
    req.data.schedule = busDetails
    return getFare(req).then(data => {
      const avaialble = data.result[1][9].split(',')
      req.data.seats.forEach(seat => {
        const idx = avaialble.indexOf(seat)
        if (idx !== -1) {
          const price = avaialble[idx].split('|')
          req.data.rawSeats.push(price[0])
          req.data.totalAmount += parseFloat(price[1])
          req.data.validSeats.push(seat)
        }
      })

      if (req.data.validSeats.length !== req.data.seats.length) {
        throw new CError({
          status: 409,
          message: req.data.validSeats,
          name: 'NotFound'
        })
      }

      req.data.tax = getTax(req.data.totalAmount, req.data.schedule.service_tax_percent)
      return next()
    })
  }).catch(err => {
    next(error(err))
  })
}

module.exports = getSchedule

function getFare (req) {
  return api('availability', req.body.sId)
}

function getTax (amount, taxPercent) {
  return (taxPercent * amount) / 100
}
