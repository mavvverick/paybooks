const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seatSchema = new mongoose.Schema({
  num: String,
  x: Number,
  y: Number,
  typ: String,
  price: Number,
  disc: Number,
  isVert: Boolean
}, {
  _id: false,
  timestamps: false
})

const deckDataSchema = new Schema({
  bId: String,
  name: String,
  meta: String,
  config: {
    bus: {
      x: {
        type: Number,
        default: 9
      },
      y: {
        type: Number,
        default: 4
      }
    },
    layout: String,
    seats: [{
      type: seatSchema
    }]
  }
})

const DeckData = mongoose.model('deck', deckDataSchema)

module.exports = DeckData
