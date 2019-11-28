const CError = require('../errors/cError')
const error = require('http-errors')
const _resp = require('../lib/resp')
const scheduleModel = require('../db/mongo/schedule')
const api = require('../lib/bitla')
// const scheduleParams = require('../utils/scheduleSchema')
const elastic = require('../config/elasticsearch')

function cities (req, res, next) {
  return elastic.search({
    index: 'cities',
    filter_path: 'hits.hits._source',
    body: {
      size: parseInt(process.env.SEARCH_LIMIT),
      query: {
        match: {
          name: {
            query: req.query.q,
            operator: 'and'
          }
        }
      }
    }
  }).then(cities => {
    res.json(_resp(cities))
  }).catch(err => {
    next(error(err))
  })
}

function search (req, res, next) {
  req.hash = '' + req.body.frm + req.body.whr
  req.date = new Date(`${req.body.date}T00:00:00.000Z`)
  return elastic.search({
    index: 'schedules',
    filter_path: 'hits.hits._source',
    body: {
      // size: parseInt(process.env.SEARCH_LIMIT),
      query: queryBuilder(req)
    }
  }).then(cities => {
    let data = []
    if (cities.hasOwnProperty('hits')) {
      data = cities.hits.hits
    }
    res.json(_resp(data))
  }).catch(err => {
    next(error(err))
  })

  // const dt = new Date(req.body.date)
  // return scheduleModel.find({
  //   travel_date: dt,
  //   hash: '' + req.body.frm + req.body.whr
  // }).select(scheduleParams)
  //   .lean()
  //   .then(data => {
  //     res.json(_resp(data))
  //   }).catch(err => {
  //     next(error(err))
  //   })
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
}

module.exports = {
  search,
  available,
  cities
}

function queryBuilder (req) {
  const timeConf = {
    a: { gte: '00:00', lte: '06:00' },
    b: { gte: '06:00', lte: '12:00' },
    c: { gte: '12:00', lte: '18:00' },
    d: { gte: '18:00', lte: '23:59' }
  }

  const query = {
    bool: { must: [] }
  }

  query.bool.must.push(_gen('hash', req.hash))
  query.bool.must.push(_gen('travel_date', req.date.getTime()))

  if (req.body.hasOwnProperty('amenities')) {
    req.body.amenities.forEach(amenity => {
      query.bool.must.push(_gen('amenities', amenity))
    })
  }

  if (req.body.hasOwnProperty('dep_time')) {
    query.bool.must.push(_range('dep_time', req.body.dep_time))
  }

  if (req.body.hasOwnProperty('arr_time')) {
    query.bool.must.push(_range('arr_time', req.body.arr_time))
  }

  if (req.body.hasOwnProperty('is_ac')) {
    query.bool.must.push(_gen('is_ac_bus', req.body.is_ac))
  }

  function _gen (key, value) {
    const data = {}
    data.match = {}
    data.match[key] = value
    return data
  }

  function _range (key, value) {
    const data = { range: { } }
    data.range[key] = timeConf[value]
    return data
  }
  return query
}
