const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cityPairSchema = new Schema({
  oId: Number,
  dId: Number,
  tIds: Number
})

const CityPair = mongoose.model('cityPair', cityPairSchema)

module.exports = CityPair
