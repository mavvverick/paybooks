require('dotenv').config()
require('../config/mongo.connect.service')
const api = require('../lib/bitla')
const scheduleModel = require('../db/mongo/schedule')
const cache = require('../lib/cache')
const elastic = require('../config/elasticsearch')

getSchedules(10)
// listSchedules(1)
// unListSchedules(1)
// syncListElasticSearch(1)
// delteteUnListElasticSearch(1)
// clearCache(90)

function getSchedules (num) {
  var dates = getDates(new Date(), num)
  dates.forEach(function (d) {
    const dt = formatDate(d)
    return api('opSchedule', `/3027/${dt}`).then(opScs => {
      delete opScs.result[0]
      const promiseArr = opScs.result.map(function (opSchedule) {
        // return the promise to array
        return api('schedule', opSchedule[0])
          .then(schedule => {
            // TODO CACHE TO REDIS
            if (schedule.hasOwnProperty('response')) {
              return false
              // return cache.setRawSchedules(`unlist-${dt}`, opSchedule[0], JSON.stringify(schedule.response))
            }
            console.log(schedule.result.travel_date)
            // return cache.setRawSchedules(`list-${dt}`, schedule.result.id, JSON.stringify(schedule.result))
          })
      })
      return Promise.all(promiseArr)
    }).then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  })
}

function listSchedules (num) {
  var dates = getDates(new Date(), num)
  dates.forEach(function (d) {
    const dt = formatDate(d)
    return cache.getRawSchedules(`list-${dt}`)
      .then(schedules => {
        Object.keys(schedules).forEach(function (scheduleId) {
          const data = schedules[scheduleId]
          const schedule = JSON.parse(JSON.parse(data))
          return scheduleModel.findOneAndUpdate({
            id: scheduleId
          }, schedule, { upsert: true })
            .then(ee => {
              console.log('DONE --- ', scheduleId)
            }).catch(err => {
              console.log('ERROR --- ', scheduleId, err)
            })
        })
      })
  })
}

function unListSchedules (num) {
  var dates = getDates(new Date(), num)
  dates.forEach(function (d) {
    const dt = formatDate(d)
    return cache.getRawSchedules(`unlist-${dt}`)
      .then(schedules => {
        Object.keys(schedules).forEach(function (scheduleId) {
          // const data = schedules[scheduleId]
          return scheduleModel.findOneAndUpdate({
            id: scheduleId
          }, { status: 'Cancel' })
            .then(data => {
              console.log('DONE --- ', scheduleId)
            }).catch(err => {
              console.log('ERROR --- ', scheduleId, err)
            })
        })
      })
  })
}

function syncListElasticSearch (num) {
  const elasticList = []
  var dates = getDates(new Date(), num)
  const promiseArr = dates.map(function (d) {
    const dt = formatDate(d)
    return cache.getRawSchedules(`list-${dt}`)
      .then(schedules => {
        Object.keys(schedules).forEach(function (scheduleId) {
          const data = schedules[scheduleId]
          const schedule = JSON.parse(JSON.parse(data))
          const idx = { index: { _index: 'schedules', _id: scheduleId } }
          const elatciData = serialize(schedule)
          elasticList.push(idx, elatciData)
        })
      }).catch(err => {
        console.log(err)
      })
  })
  Promise.all(promiseArr).then(data => {
    return elastic.bulk(elasticList)
      .then(data => {
        console.log(data)
      })
  }).catch(err => {
    console.log(err)
  })
}

function delteteUnListElasticSearch (num) {
  const elasticList = []
  var dates = getDates(new Date(), num)
  const promiseArr = dates.map(function (d) {
    const dt = formatDate(d)
    return cache.getRawSchedules(`unlist-${dt}`)
      .then(schedules => {
        Object.keys(schedules).forEach(function (scheduleId) {
          const idx = { delete: { _index: 'schedules', _id: scheduleId } }
          elasticList.push(idx)
        })
      }).catch(err => {
        console.log(err)
      })
  })
  Promise.all(promiseArr).then(data => {
    return elastic.bulk(elasticList)
      .then(data => {
        console.log(data)
      })
  }).catch(err => {
    console.log(err)
  })
}

function updateRoutes (num) {
  var dates = getDates(new Date(), num)
  dates.forEach(function (d) {

  })
}

function clearCache (num) {
  var dates = getDates(new Date(), num)
  dates.forEach(function (d) {
    const dt = formatDate(d)
    cache.cleanRawSchedules(`list-${dt}`)
    cache.cleanRawSchedules(`unlist-${dt}`)
  })
}

// UPDATE RESPIECTIVE FIELDS
// REMOVE SCHEDULES
// CLEAR CACHE

function formatDate (d) {
  const date = ('0' + d.getDate()).slice(-2)
  const month = d.getMonth() + 1 // Since getMonth() returns month from 0-11 not 1-12
  const year = d.getFullYear()
  return `${year}-${month}-${date}`
}

function getDates (startDate, noOfDays) {
  var dates = []
  var currentDate = startDate
  var addDays = function (days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }

  var endDate = new Date()
  endDate.setDate(endDate.getDate() + noOfDays)
  while (currentDate <= endDate) {
    dates.push(currentDate)
    currentDate = addDays.call(currentDate, 1)
  }
  return dates
}

function serialize (data) {
  return {
    id: data.id,
    hash: '' + data.origin_id + data.destination_id,
    travel_date: data.travel_date,
    amenities: data.amenities,
    name: data.name,
    origin_id: data.origin_id,
    destination_id: data.destination_id,
    description: data.description,
    arr_time: data.arr_time,
    dep_time: data.dep_time,
    duration: data.duration,
    bus_type: data.bus_type,
    can_cancel: data.can_cancel,
    route_id: data.route_id,
    via: data.via,
    cost: data.cost,
    main_dep_time: data.main_dep_time,
    is_ac_bus: data.is_ac_bus,
    total_seats: data.bus_layout.total_seats,
    available: data.bus_layout.available.split(',').length
  }
}
