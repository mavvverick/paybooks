const mongoose = require('mongoose')
const Schema = mongoose.Schema

const creditSchema = new Schema({
  agentMobile: Number,
  agentName: Number,
  amountINR: Number,
  staff: String,
  status: {
    type: String,
    enum: ['PENDING', 'SETTLED'],
    default: 'PENDING'
  },
  paymentInfo: String,
  remarks: String
}, {
  timestamps: true
})

const Credit = mongoose.model('credit', creditSchema)
module.exports = Credit
