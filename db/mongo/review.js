const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  sId: Number,
  user: String,
  cmnt: String,
  rt: Number
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
