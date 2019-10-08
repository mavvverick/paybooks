const cache = require('../lib/cache')
const CError = require('../errors/cError')
const error = require('http-errors')
const busModel = require('../db/mongo/bus')

function getBusData (req, res, next) {
  return cache.getBusDetails(req.body.bId)
    .then(busDetails => {
      if (!busDetails) {
        return busModel.findOne({
          bId: req.body.bId
        }).lean().then(busDetails => {
          if (!busDetails) {
            return next(error(new CError({
              status: 404,
              message: 'No bus data found.',
              name: 'NotFound'
            })))
          }
          cache.setBusDetails(req.body.bId, busDetails)
          req.bus = busDetails
          // filterboardingData(req)
          return next()
        }).catch(err => {
          next(error(err))
        })
      }
      req.bus = busDetails
      // filterboardingData(req)
      return next()
    }).catch(err => {
      next(error(err))
    })
}

module.exports = getBusData
