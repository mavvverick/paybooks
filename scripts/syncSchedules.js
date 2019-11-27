require('dotenv').config()
require('../config/mongo.connect.service')
const api = require('../lib/bitla')
const scheduleModel = require('../db/mongo/schedule')

init()

function init (dateStr) {
  return api('opSchedule', '/3027/2019-11-29').then(opScs => {
    delete opScs.result[0]
    opScs.result.forEach(opSchedule => {
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
          return scheduleModel.findOneAndUpdate({
            id: schedule.result.id
          }, schedule.result, { upsert: true })
            .then(data => {
              console.log('DONE ', opSchedule[0])
            }).catch(err => {
              console.log('ERROR --- ', opSchedule[0], err)
            })
        }).catch(err => {
          console.log('ERROR --- ', opSchedule[0], err.message)
        })
    })
  }).catch(err => {
    console.log(err)
  })
}
