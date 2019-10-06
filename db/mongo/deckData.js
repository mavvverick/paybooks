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

const stopSchema = new mongoose.Schema({
  name: String,
  contact: String,
  bpTmin: String,
  eta: String,
  Landmark: String,
  Address: String
}, {
  _id: false,
  timestamps: false
})
const deckDataSchema = new Schema({
  bId: String,
  pick: [stopSchema],
  drop: [stopSchema],
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
