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
    endpoint: ''
  },
  availabilty: {
    typ: 'GET',
    endpoint: ''
  },
  book: {
    typ: 'POST',
    endpoint: ''
  }
}

module.exports = function (key, message) {
  var options = {
    method: api[key].typ,
    uri: process.env.BITLA_STAGE + '/gds/api/' + api[key].endpoint,
    headers: {
      'api-key': process.env.BITLA_KEY,
      'content-type': 'application/json'
    }
  }

  if (message !== undefined) {
    options.body = message
  }

  if (options.method === 'POST' || options.method === 'PUT') {
    options.json = true
  }

  options.qs = {
    api_key: process.env.BITLA_KEY
  }

  return qs(options)
}
