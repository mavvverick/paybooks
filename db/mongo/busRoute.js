const mongoose = require('mongoose')
const Schema = mongoose.Schema

const busRouteSchema = new Schema({
  pId: Number,
  dId: Number,
  isMain: Boolean,
  arr: String,
  dest: String,
  rkey: String
})

const Route = mongoose.model('route', busRouteSchema)

module.exports = Route
