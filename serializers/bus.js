const Joi = require('joi')

const search = {
  body: {
    frm: Joi.string().required(),
    whr: Joi.string().required(),
    date: Joi.string().required(),
    dTimes: Joi.array(),
    aTimes: Joi.array(),
    bc: Joi.array(),
    amenities: Joi.array()
  }
}

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

const commitBook = {
  body: {
    userId: Joi.string().required(),
    currency: Joi.string().valid('INR').required(),
    orderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string().required()
  }
}

const seats = {
  query: {
    bId: Joi.string().required(),
    date: Joi.string().required()
  }
}

const cancel = {
  body: {
    bookId: Joi.number().required(),
    seats: Joi.string().required()
  }
}

module.exports = {
  search,
  initBook,
  commitBook,
  seats,
  cancel
}
