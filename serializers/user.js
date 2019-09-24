const Joi = require('joi')

const booking = {
  params: {
    filter: Joi.string().required()
  }
}

const update = {
  body: {

  }
}

module.exports = {
  booking,
  update
}
