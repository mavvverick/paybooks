const Joi = require('joi')

const init = {
  body: {
    phone: Joi.string().required()
  }
}

const token = {
  body: {
    phone: Joi.string().required(),
    otp: Joi.number().required()
  }
}

module.exports = {
  init,
  token
}
