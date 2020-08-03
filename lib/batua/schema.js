const Joi = require('joi')
const app = ['BUS', 'FLEET', 'FREIGHT', 'CAPTAIN', 'AGENT']
const currency = ['INR', 'USD', 'EUR', 'PND', 'BCN']

function validateBalance (data) {
  const schema = Joi.object().keys({
    userId: Joi.string().required()
  })
  const validate = Joi.validate(data, schema)
  if (validate.error !== null) {
    throw new Error(validate.error.details[0].message)
  }
  return validate.value
}

function validateCreateWallet (data) {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    app: Joi.string().valid(app).required()
  })
  const validate = Joi.validate(data, schema)
  if (validate.error !== null) {
    throw new Error(validate.error.details[0].message)
  }
  return validate.value
}

function validateTransaction (data) {
  const schema = Joi.object().keys({
    orderId: Joi.string().allow(''),
    userId: Joi.string().required(),
    currency: Joi.string()
      .valid('INR', 'USD', 'EUR', 'PND', 'BCN').required(),
    to: Joi.string().required(),
    from: Joi.string().required(),
    app: Joi.string().valid(app).required(),
    provider: Joi.string()
      .valid('RZP', 'PAYTM', 'SELF').required(),
    cgst: Joi.number().greater(-1).precision(2),
    igst: Joi.number().greater(-1).precision(2),
    sgst: Joi.number().greater(-1).precision(2),
    amount: Joi.number().greater(0).precision(2).required(),
    fee: Joi.number().required(),
    meta: Joi.string().required(),
    note: Joi.string().allow(''),
    type: Joi.string()
      .valid('DR', 'CR').required(),
    code: Joi.string().required(),
    status: Joi.string().valid('INIT', 'PENDING', 'COMMITED',
      'DONE', 'COMPLETED', 'CANCEL',
      'FAILED').required(),
    ip: Joi.string()
  })

  const validate = Joi.validate(data, schema)

  if (validate.error !== null) {
    throw new Error(validate.error.details[0].message)
  }

  return validate.value
}

function validateCreateTransaction (data) {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    to: Joi.string().required(),
    from: Joi.string().required(),
    orderId: Joi.string().required(),
    code: Joi.string().required(),
    type: Joi.string()
      .valid('DR', 'CR').required(),
    app: Joi.string().valid(app).required(),
    provider: Joi.string()
      .valid('RZP', 'PAYTM').required(),
    extra: Joi.string().allow(''),
    currency: Joi.string().valid(currency).required(),
    amount: Joi.number().greater(0).precision(2).required(),
    fee: Joi.number().greater(-1).precision(2),
    cgst: Joi.number().greater(-1).precision(2),
    igst: Joi.number().greater(-1).precision(2),
    sgst: Joi.number().greater(-1).precision(2),
    ip: Joi.string().required()
  })

  const validate = Joi.validate(data, schema)

  if (validate.error !== null) {
    throw new Error(validate.error)
  }

  return validate.value
}

function validateRzpData (data) {
  var schema = Joi.object({
    transactionId: Joi.string(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_order_id: Joi.string().required(),
    razorpay_signature: Joi.string().required()
  })

  const validate = Joi.validate(data, schema)

  if (validate.error !== null) {
    throw new Error(validate.error)
  }

  return validate.value
}

function validatePaytmData (data) {
  var schema = Joi.object({
    ORDERID: Joi.string().required(),
    BANKTXNID: Joi.string().allow('').required(),
    RESPMSG: Joi.string().required(),
    RESPCODE: Joi.string().required(),
    STATUS: Joi.string().required(),
    CHECKSUMHASH: Joi.string().required(),
    MID: Joi.string().required(),
    TXNAMOUNT: Joi.string().required(),
    CURRENCY: Joi.string().required(),
    TXNID: Joi.string(),
    GATEWAYNAME: Joi.string(),
    PAYMENTMODE: Joi.string(),
    TXNDATE: Joi.string(),
    BANKNAME: Joi.string()
  })

  const validate = Joi.validate(data, schema)
  if (validate.error !== null) {
    throw new Error(validate.error)
  }

  return validate.value
}

function refundPayment(data) {
  var schema = Joi.object({
    transactionId: Joi.string().required(),
    userId: Joi.string().required(),
    amount: Joi.number().required(),
    message: Joi.string().required()
  })

  const validate = Joi.validate(data, schema)

  if (validate.error !== null) {
    throw new Error(validate.error)
  }

  return validate.value
}



module.exports = {
  validateBalance,
  validateTransaction,
  validateCreateWallet,
  validateCreateTransaction,
  validateRzpData,
  validatePaytmData,
  refundPayment
}
