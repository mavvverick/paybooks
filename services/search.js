const CError = require('../errors/cError')
const error = require('http-errors')
const _resp = require('../lib/resp')
const scheduleModel = require('../db/mongo/schedule')
const routeModel = require('../db/mongo/liveRoute')
const api = require('../lib/bitla')
const sql = require('../db/sql')
const elastic = require('../config/elasticsearch')
const lruCache = require('../config/lruCache')

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
    let data = []
    if (cities.hasOwnProperty('hits')) {
      data = cities.hits.hits
    }
    res.json(_resp(data))
  }).catch(err => {
    next(error(err))
  })
}

function search (req, res, next) {
  req.hash = parseInt('' + req.body.frm + req.body.whr)
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

    const promiseArr = data.map(function (source) {
      const sid = source._source.id
      return api('availability', sid).then(avalibality => {
        source._source.available = avalibality.result[1][2]
      })
    })

    Promise.all(promiseArr).then(ee => {
      res.json(_resp(data))
    })
  }).catch(err => {
    next(error(err))
  })
}

function available (req, res, next) {
  const timeOffset = new Date()
  timeOffset.setUTCHours(0, 0, 0, 0)
  return scheduleModel.findOne({
    travel_date: { $gte: timeOffset },
    id: req.query.sid
  }).select({
    _id: 0,
    service_tax_percent: 1,
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
        // Update available data to elastic search
        // elastic.updateDocument(
        //   'schedules',
        //   req.query.sid,
        //   { doc: { available: data.result[1][2] } }
        // ).catch(err => {
        //   console.log(err)
        // })

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

function poupular (req, res, next) {
  if (lruCache.peek('popular')) {
    return res.json(_resp(lruCache.get('popular')))
  }
  return sql.Route.findAll({
    attributes: ['origin_id', 'dest_id'],
    where: {
      isActive: true
    },
    include: [{
      model: sql.City,
      as: 'origin',
      attributes: ['name']
    }, {
      model: sql.City,
      as: 'dest',
      attributes: ['name']
    }]
  }).then(routeData => {
    const routes = []
    routeData.forEach(route => {
      routes.push({
        origin_id: route.origin_id,
        dest_id: route.dest_id,
        dest: route.dest.name,
        origin: route.origin.name
      })
    })
    lruCache.set('popular', routes)
    return res.json(_resp(routes))
  }).catch(err => {
    next(error(err))
  })
}

function getTime (someDate) {
  const today = new Date()
  if (someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()) {
    const currentOffset = today.getTimezoneOffset()
    const ISTOffset = 330 // IST offset UTC +5:30
    const ISTTime = new Date(today.getTime() + (ISTOffset + currentOffset) * 60000)
    const hrs = ('0' + ISTTime.getHours()).slice(-2)
    const min = ('0' + ISTTime.getMinutes()).slice(-2)
    return hrs + ':' + min
    // return today.getHours() + ':' + today.getMinutes()
  } else {
    return false
  }
}

module.exports = {
  search,
  available,
  cities,
  poupular
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

  const timeCheck = getTime(req.date)

  if (timeCheck) {
    query.bool.must.push(_range('dep_time', { gte: timeCheck }))
  }

  if (req.body.hasOwnProperty('amenities')) {
    req.body.amenities.forEach(amenity => {
      query.bool.must.push(_gen('amenities', amenity))
    })
  }

  if (req.body.hasOwnProperty('dep_time')) {
    query.bool.must.push(_range('dep_time', timeConf[req.body.dep_time]))
  }

  if (req.body.hasOwnProperty('arr_time')) {
    query.bool.must.push(_range('arr_time', timeConf[req.body.arr_time]))
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
    data.range[key] = value
    return data
  }
  return query
}
