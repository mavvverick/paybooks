const cache = require('../lib/cache')
const CError = require('../errors/cError')
const error = require('http-errors')
const deckData = require('../db/mongo/deckData')

function getBusData (req, res, next) {
  return cache.getDeckData(req.body.bId)
    .then(deckDetails => {
      if (!deckDetails) {
        return deckData.findOne({
          bId: req.body.bId
        }).lean().then(deckDetails => {
          if (!deckDetails) {
            return next(error(new CError({
              status: 404,
              message: 'No deck data found.',
              name: 'NotFound'
            })))
          }
          cache.setDeckData(req.body.bId, deckDetails)
          req.deck = deckDetails
          filterSeatData(req)
          return next()
        }).catch(err => {
          next(error(err))
        })
      }
      req.deck = deckDetails
      filterSeatData(req)
      return next()
    }).catch(err => {
      next(error(err))
    })
}

module.exports = getBusData

function filterSeatData (req) {
  req.deck.config = req.body.seats.split(',').map(seat => {
    return req.deck.seats.filter(seatData => {
      return seatData.num === seat
    })[0]
  })
  return req
}
