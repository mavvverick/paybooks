const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  maxseat: Number,
  bc: {
    IsAc: Boolean,
    IsNonAc: Boolean,
    IsSeater: Boolean,
    IsSleeper: Boolean
  },
  // restStopList: [{
  //   latLon: String,
  //   arTime: String,
  //   locName: String,
  //   duration: Number
  // }],
  // bpData: [{
  //   name: String,
  //   BpTm: String,
  //   bpTminmin: Number,
  //   eta: Number,
  //   Landmark: String,
  //   Address: String
  // }],
  // dpData: [{
  //   name: String,
  //   BpTm: String,
  //   bpTminmin: Number,
  //   eta: Number,
  //   Landmark: String,
  //   Address: String
  // }],
  // config: {
  //   layout: String,
  //   upper: [{
  //     num: String,
  //     x: Number,
  //     y: Number,
  //     type: Number,
  //     price: Number,
  //     isLast: Boolean
  //   }],
  //   lower: [{
  //     num: String,
  //     x: Number,
  //     y: Number,
  //     type: Number,
  //     price: Number,
  //     isLast: Boolean
  //   }]
  // },
  maxCanTime: Number,
  maxReschTime: Number,
  rating: Number
})

const Bus = mongoose.model('bus', busSchema)

module.exports = Bus
