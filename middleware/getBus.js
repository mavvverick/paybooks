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
        }).then(busDetails => {
          if (!busDetails) {
            return next(error(new CError({
              status: 404,
              message: 'No bus data found.',
              name: 'NotFound'
            })))
          }
          cache.setBusDetails(req.body.bId, busDetails)
          req.bus = busDetails
          filterboardingData(req)
          return next()
        }).catch(err => {
          next(error(err))
        })
      }
      req.bus = busDetails
      filterboardingData(req)
      return next()
    }).catch(err => {
      next(error(err))
    })
}

function filterboardingData (req) {
  req.board = req.bus.bpData.filter(board => { return board.name === req.body.bPoint })[0]
  req.drop = req.bus.dpData.filter(drop => { return drop.name === req.body.dPoint })[0]
  return req
}

module.exports = getBusData
