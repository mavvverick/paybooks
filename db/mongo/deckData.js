const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deckDataSchema = new Schema({
  bId: String,
  bpData: [{
    name: String,
    contact: String,
    BpTm: String,
    bpTminmin: Number,
    eta: Number,
    Landmark: String,
    Address: String
  }],
  dpData: [{
    name: String,
    contact: String,
    BpTm: String,
    bpTminmin: Number,
    eta: Number,
    Landmark: String,
    Address: String
  }],
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
      num: String,
      x: Number,
      y: Number,
      type: Number,
      price: Number,
      dst: Number,
      isVert: Boolean
    }]
  }
})

const DeckData = mongoose.model('deck', deckDataSchema)

module.exports = DeckData
