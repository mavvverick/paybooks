'use strict'
const Razorpay = require('razorpay')
const crypto = require('crypto')

const rzp = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET
})

rzp.ValidateOrder = (data) => {
  const message = data.orderId + '|' + data.paymentId
  const signature = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET)
    .update(message).digest('hex')
  const validate = signature === data.signature
  return validate
}

module.exports = rzp
