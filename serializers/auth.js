const Joi = require('joi')

const init = {
  body: {
    phone: Joi.string().regex(/^[0-9]{10}$/).required()
  }
}

const token = {
  body: {
    phone: Joi.string().regex(/^[0-9]{10}$/).required(),
    otp: Joi.number().required()
  }
}

module.exports = {
  init,
  token
}
