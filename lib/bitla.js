const qs = require('request-promise')

const api = {
  master: {
    typ: 'GET',
    endpoint: 'masters.json'
  },
  operators: {
    typ: 'GET',
    endpoint: 'operators.json'
  },
  cities: {
    typ: 'GET',
    endpoint: 'cities.json'
  },
  city_pairs: {
    typ: 'GET',
    endpoint: 'city_pairs.json'
  },
  stages: {
    typ: 'GET',
    endpoint: 'stages.json'
  },
  bus: {
    typ: 'GET',
    endpoint: ''
  },
  schedule: {
    typ: 'GET',
    endpoint: 'schedule/'
  },
  opSchedule: {
    typ: 'GET',
    endpoint: 'operator_schedules'
  },
  availability: {
    typ: 'GET',
    endpoint: 'availability/'
  },
  book: {
    typ: 'POST',
    endpoint: 'tentative_booking/'
  },
  validate: {
    typ: 'POST',
    endpoint: 'confirm_booking/'
  },
  canCancel: {
    typ: 'GET',
    endpoint: 'can_cancel.json'
  },
  cancel: {
    typ: 'GET',
    endpoint: 'cancel_booking.json'
  }
}

module.exports = function (key, message) {
  var options = {
    method: api[key].typ,
    uri: process.env.BITLA_PROD + '/gds/api/' + api[key].endpoint,
    headers: {
      'api-key': process.env.BITLA_KEY_PROD,
      'content-type': 'application/json'
    },
    gzip: true,
    json: true
  }

  if (key === 'schedule' ||
      key === 'availability' ||
      key === 'validate' ||
      key === 'opSchedule') {
    options.uri += message + '.json'
  } else if (key === 'book') {
    options.uri += message[0] + '.json'
    options.body = message[1]
  } else if (key === 'canCancel' ||
    key === 'cancel') {
    options.uri += message
  } else if (message !== undefined) {
    options.body = message
  }

  if (options.method === 'POST' || options.method === 'PUT') {
    options.json = true
  }

  //   options.qs = {

  //   }

  console.log(options)

  return qs(options)
}
