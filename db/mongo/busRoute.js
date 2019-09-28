const mongoose = require('mongoose')
const Schema = mongoose.Schema

const busRouteSchema = new Schema({
  frm: String,
  whr: String,
  IsMain: Boolean
})

const Route = mongoose.model('route', busRouteSchema)

module.exports = Route
