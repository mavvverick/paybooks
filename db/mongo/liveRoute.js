const mongoose = require('mongoose')
const Schema = mongoose.Schema

const liveRouteSchema = new Schema({
  routeId: Number,
  origin: String,
  origin_id: Number,
  dest: String,
  dest_id: Number,
  sort: Number,
  isActive: Boolean,
  isPopular: Boolean
})

const LiveRoute = mongoose.model('LiveRoute', liveRouteSchema)
module.exports = LiveRoute
