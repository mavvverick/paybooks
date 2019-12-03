const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seatSchema = new Schema({
  seat_number: String,
  cancel_percent: Number,
  refund_amount: Number,
  cancelled_fare: Number,
  base_cancelled_fare: Number,
  cancelled_service_tax: Number
}, {
  _id: false
})

const cancelSchema = new Schema({
  ticket_number: String,
  reason: String,
  refund_amount: Number,
  cancellation_charges: Number,
  seat_numbers: String,
  cancel_seat_details: [{ cancel_seat_detail: seatSchema }, {
    _id: false
  }],
  operator_gst_details: Object
})

const Cancel = mongoose.model('cancel', cancelSchema)

module.exports = Cancel
