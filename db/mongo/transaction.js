const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
  pnr: String,
  opPnr: String,
  travelDate: String,
  state: {
    type: String,
    enum: ['Init', 'Confirmed', 'Pending'],
    default: 'Init'
  },
  travelId: Number,
  scheduleId: Number,
  reservationId: Number,
  name: String,
  fare: Number,
  userId: String,
  orderId: String,
  paymentId: String,
  meta: String
})

const Transaction = mongoose.model('booking', transactionSchema)

module.exports = Transaction
