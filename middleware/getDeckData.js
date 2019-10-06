const cache = require('../lib/cache')
const CError = require('../errors/cError')
const error = require('http-errors')
const deckData = require('../db/mongo/deckData')

function getBusData (req, res, next) {
  const busId = req.query.bId || req.body.bId
  return cache.getDeckData(busId)
    .then(deckDetails => {
      if (!deckDetails) {
        return deckData.findOne({
          bId: busId
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
          if (req.url === '/init') {
            filterSeatData(req)
            filterboardingData(req)
          }

          return next()
        }).catch(err => {
          next(error(err))
        })
      }
      req.deck = deckDetails
      if (req.url === '/init') {
        filterSeatData(req)
        filterboardingData(req)
      }
      return next()
    }).catch(err => {
      next(error(err))
    })
}

module.exports = getBusData

function filterSeatData (req) {
  req.deck.config.bookedSeats = []
  req.deck.finalAmount = 0
  req.body.seats.split(',').forEach(seat => {
    return req.deck.config.seats.forEach(seatData => {
      if (seatData.num === seat) {
        req.deck.config.bookedSeats.push(seatData)
        req.deck.finalAmount += seatData.price
      }
    })
  })

  if (req.deck.config.bookedSeats.length < 1) {
    throw new CError({
      status: 404,
      message: 'No valid seats found.',
      name: 'NotFound'
    })
  }

  delete req.deck.config.seats
  return req
}

function filterboardingData (req) {
  req.deck.pick = req.deck.pick.filter(board => { return board.name === req.body.bPoint })[0]
  req.deck.drop = req.deck.drop.filter(drop => { return drop.name === req.body.dPoint })[0]

  if (req.deck.pick === undefined || req.deck.drop === undefined) {
    throw new CError({
      status: 404,
      message: 'No valid stops found.',
      name: 'NotFound'
    })
  }
  return req
}
