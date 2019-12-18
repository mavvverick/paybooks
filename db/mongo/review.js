const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  sId: String,
  user: String,
  cmnt: String,
  rt: Number
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
