const mongoose = require('mongoose')

const SupportSchema = new mongoose.Schema({
  phNumber: String,
  deviceName: String,
  appVersion: String,
  state: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED'],
    default: 'ACTIVE'
  },
  category: String,
  description: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

const Support = mongoose.model('Support', SupportSchema)

module.exports = Support
