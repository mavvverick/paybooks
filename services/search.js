const CError = require('../errors/cError')
const error = require('http-errors')
const _resp = require('../lib/resp')
const scheduleModel = require('../db/mongo/schedule')
const api = require('../lib/bitla')
const scheduleParams = require('../utils/scheduleSchema')
function search (req, res, next) {
  // TODO Elastic search with listing data
  const dt = new Date(req.body.date)
  return scheduleModel.find({
    travel_date: dt,
    hash: '' + req.body.frm + req.body.whr
  }).select(scheduleParams)
    .lean()
    .then(data => {
      res.json(_resp(data))
    }).catch(err => {
      next(error(err))
    })
}

function available (req, res, next) {
  // TODO check travel date gte than current date
  return scheduleModel.findOne({
    travel_date: { $gte: Date.now() },
    id: req.query.sid
  }).select({
    _id: 0,
    'bus_layout.total_seats': 1,
    'bus_layout.coach_details': 1,
    'bus_layout.boarding_stages': 1,
    'bus_layout.dropoff_stages': 1
  }).lean().then(schedule => {
    if (!schedule) {
      return next(error(new CError({
        status: 404,
        message: 'No schedule found.',
        name: 'NotFound'
      })))
    }
    return api('availability', req.query.sid)
      .then(data => {
        schedule.available = {
          num: data.result[1][2],
          seats: data.result[1][9],
          ladies: data.result[1][10],
          gents: data.result[1][11]
        }
        return res.json(_resp(schedule))
      })
  }).catch(err => {
    next(error(err))
  })

  // return api('availability', req.query.sid)
  //   .then(data => {
  //     const avaialble = {
  //       fare: data.result[1][4],
  //       seats: data.result[1][2],
  //       available: data.result[1][9],
  //       ladies: data.result[1][10],
  //       gents: data.result[1][11]
  //     }

  //     return res.json(_resp(avaialble))
  //   })
}

module.exports = {
  search,
  available
}
