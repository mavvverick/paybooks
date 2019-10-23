const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

const busSchema = new Schema({
  bId: String,
  rId: Number,
  frm: String,
  whr: String,
  typ: String,
  rt: {
    toRt: String,
    ct: String
  },
  dt: {
    type: Number
  },
  at: {
    type: Number
  },
  dst: String,
  frLst: [String],
  name: {
    type: String
  },
  wnSt: Number,
  toSt: Number,
  avail: Number,
  ext: {
  },
  nonOpDays: [Number],
  amnt: [String],
  busImageCount: Number,
  maxfr: Number,
  disc: {
    type: Number,
    default: 0
  },
  maxSeat: Number,
  bc: {
    IsAc: Boolean,
    IsNonAc: Boolean,
    IsSeater: Boolean,
    IsSleeper: Boolean
  },
  pick: [stopSchema],
  drop: [stopSchema],
  maxCanTime: Number,
  maxReschTime: Number,
  rating: {
    num: Number,
    users: Number
  }
})

const Bus = mongoose.model('bus', busSchema)

module.exports = Bus
