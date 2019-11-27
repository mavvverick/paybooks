const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
  id: {
    type: Number
  },
  hash: {
    type: Number
  },
  name: {
    type: String
  },
  number: {
    type: String
  },
  service_name: {
    type: String
  },
  origin_id: {
    type: Number
  },
  destination_id: {
    type: Number
  },
  op_schedule_id: {
    type: Number
  },
  travel_date: {
    type: 'Date'
  },
  travel_id: {
    type: Number
  },
  travels_name: {
    type: String
  },
  route_id: {
    type: Number
  },
  route_map_id: {
    type: Number
  },
  available_seats: {
    type: Number
  },
  description: {
    type: String
  },
  dep_time: {
    type: String
  },
  duration: {
    type: String
  },
  arr_time: {
    type: String
  },
  bus_type: {
    type: String
  },
  cost: {
    type: String
  },
  can_cancel: {
    type: Boolean
  },
  cancellation_time: {
    type: Number
  },
  cabin_layout: {
    type: Boolean
  },
  status: {
    type: String
  },
  is_service_tax_applicable: {
    type: Boolean
  },
  helpline_number: {
    type: String
  },
  amenities: {
    type: Array
  },
  via: {
    type: String
  },
  bus_layout: {
    total_seats: {
      type: Number
    },
    coach_details: {
      type: String
    },
    available: {
      type: String
    },
    ladies_seats: {
      type: String
    },
    gents_seats: {
      type: String
    },
    ladies_booked_seats: {
      type: String
    },
    boarding_stages: {
      type: String
    },
    dropoff_stages: {
      type: String
    },
    floor: {
      type: String
    },
    last_seats: {
      type: String
    },
    forced_seats: {
      type: String
    },
    fares_hash: {
      SS: {
        Adult: {
          type: Date
        }
      }
    }
  },
  trip_id: {
    type: String
  },
  city_seq_order: {
    type: [
      String
    ]
  },
  cancellation_policy: {
    type: String
  },
  main_dep_time: {
    type: String
  },
  service_tax_percent: {
    type: Number
  },
  convenience_charge_percent: {
    type: Number
  },
  is_ac_bus: {
    type: Boolean
  },
  api_type: {
    type: Number
  },
  allow_reschedule: {
    type: Boolean
  },
  route_version: {
    type: String
  },
  flexi_fare: {
    type: String
  },
  res_details: {},
  transaction_charges: {
    type: String
  },
  no_coach_layout: {
    type: Boolean
  }
}, {
  timestamps: true
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

module.exports = Schedule
