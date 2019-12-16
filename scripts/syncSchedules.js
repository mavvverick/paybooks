require('dotenv').config()
require('../config/mongo.connect.service')
const api = require('../lib/bitla')
const scheduleModel = require('../db/mongo/schedule')
const elastic = require('../config/elasticsearch')

init()

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

function init (dateStr) {
  const elasticList = []
  var dates = getDates(new Date(), 90)

  dates.forEach(function (d) {
    const date = ('0' + d.getDate()).slice(-2)
    const month = d.getMonth() + 1 // Since getMonth() returns month from 0-11 not 1-12
    const year = d.getFullYear()
    const dt = `${year}-${month}-${date}`
    return api('opSchedule', `/3027/${dt}`).then(opScs => {
      delete opScs.result[0]
      const promiseArr = opScs.result.map(function (opSchedule) {
        if (opSchedule[18] !== 'Update' &&
            opSchedule[18] !== 'New') {
          const del = { delete: { _index: 'schedules', _id: opSchedule[0] } }
          elasticList.push(del)
          return scheduleModel.findOneAndUpdate({
            id: opSchedule[0]
          }, { status: 'Cancel' })
        }

        return api('schedule', opSchedule[0])
          .then(schedule => {
            // if (schedule.hasOwnProperty('response')) {
            //   console.log(opSchedule[0], schedule)
            //   const del = { delete: { _index: 'schedules', _id: opSchedule[0] } }
            //   elasticList.push(del)
            //   return scheduleModel.findOneAndUpdate({
            //     id: opSchedule[0]
            //   }, { status: 'Cancel' })
            // }
            console.log('HEREEEEEEE', opSchedule[0], schedule.result.origin_id, schedule.result.destination_id)
            schedule.result.hash = '' + schedule.result.origin_id + schedule.result.destination_id
            schedule.result.amenities = JSON.parse(schedule.result.amenities)
            const idx = { index: { _index: 'schedules', _id: schedule.result.id } }
            const data = serialize(schedule.result)
            elasticList.push(idx, data)

            // if (routeIds.indexOf(schedule.result.route_id) !== -1) {
            //   routeIds.push(schedule.result.route_id)
            // const route = {
            //   routeId: schedule.result.route_id,
            //   dest: '',
            //   dest_id: schedule.result.destination_id,
            //   origin: '',
            //   origin_id: schedule.result.origin_id,
            //   sort: 0,
            //   isActive: true,
            //   isPopular: true
            // }
            //   routes.push(route)
            // }

            return scheduleModel.findOneAndUpdate({
              id: schedule.result.id
            }, schedule.result, { upsert: true })
              .then(data => {
                console.log('DONE --- ', opSchedule[0])
              }).catch(err => {
                console.log('ERROR --- ', opSchedule[0], err)
              })
          })
      })

      return Promise.all(promiseArr)
    }).then(data => {
      return elastic.bulk(elasticList)
        .then(data => {
          console.log(data)
        })
    }).catch(err => {
      console.log(err)
    })
  })
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
    via: data.via,
    cost: data.cost,
    main_dep_time: data.main_dep_time,
    is_ac_bus: data.is_ac_bus,
    total_seats: data.bus_layout.total_seats,
    available: data.bus_layout.available.split(',').length
  }
}

// // Usage
// var dates = getDates(new Date(2013, 10, 22), new Date(2013, 11, 25))
// dates.forEach(function (date) {
//   console.log(date)
// })
