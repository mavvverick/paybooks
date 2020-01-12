const CError = require('../errors/cError')
const error = require('http-errors')
const scheduleModel = require('../db/mongo/schedule')
const sql = require('../db/sql')
const api = require('../lib/bitla')
const AgentCommissionPercentage = parseInt(process.env.AGENT_COMMISSION_PERCT)

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
  timeOffset.setUTCHours(0, 0, 0, 0)
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

      if (req.user.isAgent) {
        return sql.User.findOne({
          attributes: ['commPerct'],
          where: {
            userId: req.user.userId,
            isAgent: true
          }
        }).then(user => {
          if (!user) {
            throw new CError({
              status: 409,
              message: 'Agent not found',
              name: 'NotFound'
            })
          }
          req.data.totalAmount = req.data.totalAmount - getAgentCommission(req.data.totalAmount, user.commPerct)
          req.data.agent_commission_perct = user.commPerct
          return next()
        })
      } else {
        req.data.taxPercent = req.data.schedule.service_tax_percent
        return next()
      }
    })
  }).catch(err => {
    next(error(err))
  })
}

module.exports = getSchedule

function getFare (req) {
  return api('availability', req.body.sId)
}

function getAgentCommission (amount, commPerct) {
  return (commPerct * amount) / 100
}
