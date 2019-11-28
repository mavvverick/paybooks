const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seatSchema = new Schema({
  userId: String,
  seat_number: {
    type: 'String'
  },
  status: {
    type: String,
    enum: ['INIT', 'PENDING', 'CANCEL', 'DONE'],
    default: 'DONE'
  },
  fare: {
    type: 'Number'
  },
  our_commission: {
    type: 'Number'
  },
  service_tax: {
    type: 'Number'
  },
  convenience_charge: {
    type: 'Number'
  },
  offer_discount: {
    type: 'Number'
  },
  discount: {
    type: 'Number'
  },
  additional_fare: {
    type: 'Number'
  },
  tieup_agent_commission_percentage: {
    type: 'Number'
  },
  my_commission: {
    type: 'Number'
  },
  our_convenience_charge_amount: {
    type: 'Number'
  }
}, {
  _id: false
})

const seatDetailSchema = new Schema({
  seat_detail: seatSchema
}, {
  _id: false
})

const bookingSchema = new Schema({
  orderId: String,
  paymentId: String,
  meta: String,
  seatMeta: Array,
  seats: Array,
  ticket_status: {
    type: 'String'
  },
  imgs: [String],
  ticket_number: {
    type: 'String'
  },
  operator_pnr: {
    type: 'String'
  },
  travel_operator_pnr: {
    type: 'String'
  },
  origin: {
    type: 'String'
  },
  destination: {
    type: 'String'
  },
  travel_date: {
    type: 'Date'
  },
  no_of_seats: {
    type: 'Number'
  },
  seat_numbers: {
    type: 'String'
  },
  travels: {
    type: 'String'
  },
  service_number: {
    type: 'String'
  },
  bus_type: {
    type: 'String'
  },
  dep_time: {
    type: 'String'
  },
  duration: {
    type: 'String'
  },
  boarding_point_details: {
    name: {
      type: 'String'
    },
    dep_time: {
      type: 'String'
    },
    boarding_stage_address: {
      type: 'String'
    },
    landmark: {
      type: 'String'
    },
    contact_numbers: {
      type: 'String'
    }
  },
  agent_ref_number: {
    type: 'Mixed'
  },
  total_fare: {
    type: 'Number'
  },
  service_tax_percent: {
    type: 'Number'
  },
  convenience_charge_percent: {
    type: 'Number'
  },
  seat_fare_details: {
    type: [seatDetailSchema]
  },
  commission: {
    type: 'Number'
  },
  passenger_details: {
    title: {
      type: 'String'
    },
    gender: {
      type: 'String'
    },
    name: {
      type: 'String'
    },
    age: {
      type: 'Number'
    },
    mobile: {
      type: 'String'
    },
    email: {
      type: 'String'
    }
  },
  commission_percent: {
    type: 'Number'
  },
  tieup_agent_commission_percent: {
    type: 'Number'
  },
  travel_id: {
    type: 'Number'
  },
  operator_reservation_id: {
    type: 'Number'
  },
  operator_seat_wise_pnr: {
    type: 'String'
  }
}, {
  timestamps: true
})

// bookingSchema.options.toObject.transform = (doc, ret, options) => {
//   delete ret.createdAt
//   delete ret.updatedAt
//   delete ret.__v

//   return ret
// }

const Booking = mongoose.model('booking', bookingSchema)

module.exports = Booking
