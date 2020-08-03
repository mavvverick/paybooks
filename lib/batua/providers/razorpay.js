'use strict'
const Razorpay = require('razorpay')
const crypto = require('crypto')
const jobs = require('../jobs')
const CError = require('../../../errors/cError')

const rzp = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET
})

rzp.init = (data) => {
  return rzp.orders.create({
    amount: data.amount * 100,
    currency: 'INR',
    receipt: data.userId,
    payment_capture: 1,
    notes: {}
  }).catch(function (err) {
    console.log(err)
    throw new Error(err)
  })
}

rzp.validate = (paymentData) => {
  const validate = ValidateOrder(paymentData)
  if (!validate) {
    return null
  }
  return {
    currency: 'INR',
    transactionId: paymentData.transactionId,
    orderId: paymentData.razorpay_order_id,
    meta: paymentData.razorpay_payment_id,
    note: null,
    status: 'DONE'
  }
}

rzp.initRefund = (tRecord, data) => {
  let amount = tRecord.amount
  if(data.amount < tRecord.amount){
    amount = data.amount
  }
  return rzp.payments.refund(
    tRecord.meta, {
    amount: amount,
    notes: {
      note1: data.message
    }
  }).then(rData => {
    tRecord.refundAmount = amount
    tRecord.refund = `${rData.id}|${rData.status}`
    tRecord.status = 'REVERT'
    tRecord.save()
    return tRecord
  }).catch(function (err) {
    throw new Error(err)
  })
}


module.exports = rzp

const ValidateOrder = (paymentData) => {
  const message = paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id
  const signature = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET)
    .update(message).digest('hex')
  const validate = signature === paymentData.razorpay_signature
  return validate
}
