const redisClient = require('../config/redis.connect.service')

function getBusDetails (bId) {
  return redisClient.getAsync(`b:${bId}`)
    .then(busDetails => {
      return JSON.parse(busDetails)
    }).catch(err => {
      throw Error(err)
    })
}

function setBusDetails (bId, data) {
  return redisClient.setAsync(`b:${bId}`,
    JSON.stringify(data))
    .catch(err => {
      throw Error(err)
    })
}

function getDeckData (bId) {
  return redisClient.getAsync(`dk:${bId}`)
    .then(busDetails => {
      return JSON.parse(busDetails)
    }).catch(err => {
      throw Error(err)
    })
}

function setDeckData (bId, data) {
  return redisClient.setAsync(`dk:${bId}`,
    JSON.stringify(data))
    .catch(err => {
      throw Error(err)
    })
}

module.exports = {
  getBusDetails,
  setBusDetails,
  getDeckData,
  setDeckData
}
