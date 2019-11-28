require('dotenv').config()
require('../config/mongo.connect.service')
const api = require('../lib/bitla')
const scheduleModel = require('../db/mongo/schedule')
const elastic = require('../config/elasticsearch')

init()

function init (dateStr) {
  const elasticList = []
  return api('opSchedule', '/3027/2019-12-10').then(opScs => {
    delete opScs.result[0]
    const promiseArr = opScs.result.map(function (opSchedule) {
      // return the promise to array
      return api('schedule', opSchedule[0])
        .then(schedule => {
          if (schedule.hasOwnProperty('response')) {
            console.log(opSchedule[0], schedule)
            return scheduleModel.findOneAndUpdate({
              id: opSchedule[0]
            }, { status: 'Cancel' })
          }

          schedule.result.hash = '' + schedule.result.origin_id + schedule.result.destination_id
          schedule.result.amenities = JSON.parse(schedule.result.amenities)
          const idx = { index: { _index: 'schedules', _id: schedule.result.id } }
          const data = serialize(schedule.result)
          elasticList.push(idx, data)
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
    main_dep_time: data.main_dep_time,
    is_ac_bus: data.is_ac_bus,
    total_seats: data.bus_layout.total_seats
  }
}
