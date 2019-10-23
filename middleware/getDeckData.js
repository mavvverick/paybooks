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
          if (req.url === '/init' || req.url === '/book') {
            filterSeatData(req)
            filterboardingData(req)
            _serializeBusData(req)
          }

          return next()
        }).catch(err => {
          next(error(err))
        })
      }
      req.deck = deckDetails
      if (req.url === '/init' || req.url === '/book') {
        filterSeatData(req)
        filterboardingData(req)
        _serializeBusData(req)
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
  req.deck.disc = 0
  req.body.seats.split(',').forEach(seat => {
    return req.deck.config.seats.forEach(seatData => {
      if (seatData.num === seat) {
        req.deck.config.bookedSeats.push(seatData)
        req.deck.finalAmount += seatData.price
        req.deck.disc += seatData.disc
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
  req.bus.pick = req.bus.pick.filter(board => { return board.name === req.body.bPoint })[0]
  req.bus.drop = req.bus.drop.filter(drop => { return drop.name === req.body.dPoint })[0]

  if (req.bus.pick === undefined || req.bus.drop === undefined) {
    throw new CError({
      status: 404,
      message: 'No valid stops found.',
      name: 'NotFound'
    })
  }
  return req
}

function _serializeBusData (req) {
  const bookingDateTime = req.body.date + ' ' + req.body.bPoint
  const maxCanTime = getUnixTime(bookingDateTime)
  const day = getUnixTime(req.body.date) + 86400

  if (day < (Date.now() / 1000)) {
    throw new CError({
      status: 404,
      message: 'Booking date cannot be less than current date.',
      name: 'NotFound'
    })
  }

  const busData = {
    frm: req.bus.frm,
    whr: req.bus.whr,
    bPoint: req.bus.pick,
    dPoint: req.bus.drop
  }

  req.busSerializedData = {
    userId: req.user.userId,
    mob: req.body.mob,
    bId: req.bus.bId,
    rId: req.bus.rId,
    seats: req.body.seats,
    day: day,
    maxCanTime: maxCanTime + (Date.now() / 1000),
    fare: req.deck.finalAmount,
    disc: req.deck.disc,
    bus: JSON.stringify(busData)
  }

  return req
}

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
}
