const Joi = require('joi')

const initBook = {
  body: {
    bId: Joi.number().required(),
    date: Joi.string().required(),
    bookings: Joi.array().required(),
    seats: Joi.string().required(),
    name: Joi.string().required(),
    mob: Joi.string().required(),
    bPoint: Joi.string().required(),
    dPoint: Joi.string().required(),
    gst: Joi.string()
  }
}

module.exports = {
  initBook
}
