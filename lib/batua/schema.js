const Joi = require('joi')

const app = ['BUS', 'FLEET', 'FREIGHT', 'CAPTAIN', 'AGENT']
const category = ['DEPOSIT', 'WITHDRAWAL', 'REFER', 'CASHBACK',
  'COMMISSION', 'NOTE', 'REFUND', 'BOOKING', 'GATEWAY']
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
    app: Joi.string().valid(app).required(),
    provider: Joi.string()
      .valid('RZP', 'PAYTM', 'SELF').required(),
    amount: Joi.number().greater(0).precision(2).required(),
    fee: Joi.number().required(),
    meta: Joi.string().required(),
    note: Joi.string().allow(''),
    type: Joi.string()
      .valid('DR', 'CR').required(),
    category: Joi.string().valid(category).required(),
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
    orderId: Joi.string().required(),
    category: Joi.string().valid(category).required(),
    type: Joi.string()
      .valid('DR', 'CR').required(),
    app: Joi.string().valid(app).required(),
    provider: Joi.string()
      .valid('RZP', 'PAYTM').required(),
    extra: Joi.string().allow(''),
    currency: Joi.string().valid(currency).required(),
    amount: Joi.number().greater(0).precision(2).required(),
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
    razorpay_payment_id: Joi.string().required(),
    razorpay_order_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
    transactionId: Joi.string(),
    userId: Joi.string()
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
    transactionId: Joi.string(),
    userId: Joi.string(),
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

function validateFailedTransaction (data) {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    orderId: Joi.string().required(),
    app: Joi.string().valid(app).required()
  })

  const validate = Joi.validate(data, schema)

  if (validate.error !== null) {
    throw new Error(validate.error)
  }

  return validate.value
}

function validateCoinTransaction (data) {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    gameId: Joi.number().required(),
    currency: Joi.string()
      .valid('INR').required(),
    amount: Joi.number().greater(0).precision(2).required(),
    coins: Joi.number().greater(0).precision(2).required(),
    state: Joi.string().valid('DONE').required(),
    category: Joi.string()
      .valid('BUY').required(),
    type: Joi.string()
      .valid('DR', 'CR').required(),
    app: Joi.string().valid(app).required(),
    provider: Joi.string()
      .valid('SELF').required(),
    ip: Joi.string()
  })

  const validate = Joi.validate(data, schema)

  if (validate.error !== null) {
    throw new Error(validate.error)
  }

  return validate.value
}

function validatePaytmTransaction (data) {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    data: Joi.string().required(),
    isCoupon: Joi.bool()
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
  refundPayment,
  validateFailedTransaction,
  validateCoinTransaction,
  validatePaytmTransaction
}
