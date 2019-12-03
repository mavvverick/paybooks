const mongoose = require('mongoose')
const Schema = mongoose.Schema

const liveRouteSchema = new Schema({
  key: Number,
  dest: String,
  dest_id: Number,
  origin: String,
  origin_id: Number,
  sort: Number,
  isPopular: true
})

const LiveRoute = mongoose.model('LiveRoute', liveRouteSchema)
module.exports = LiveRoute
