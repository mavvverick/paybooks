const Joi = require('joi')

const city = {
  query: {
    q: Joi.string().required()
  }
}

const search = {
  body: {
    frm: Joi.number().required(),
    whr: Joi.number().required(),
    date: Joi.string().required(),
    dTimes: Joi.array(),
    aTimes: Joi.array(),
    bc: Joi.array(),
    amenities: Joi.array()
  }
}

var contactSchema = Joi.object().keys({
  mobile_number: Joi.string().required(),
  emergency_name: Joi.string().required(),
  email: Joi.string().required()
})

var gstSchema = Joi.object().keys({
  name: Joi.string(),
  gst_id: Joi.string(),
  address: Joi.string()
})

const initBook = {
  body: {
    sId: Joi.number().required(),
    seats: Joi.string().required(),
    boarding_at: Joi.string().required(),
    drop_of: Joi.string().required(),
    contact: contactSchema.required(),
    gst: gstSchema
  }
}

const commitBook = {
  body: {
    userId: Joi.string().required(),
    orderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string().required()
  }
}

const seats = {
  query: {
    sid: Joi.number().required()
  }
}

const cancel = {
  body: {
    ticket_number: Joi.string().required(),
    seats: Joi.string().required()
  }
}

module.exports = {
  search,
  initBook,
  commitBook,
  seats,
  cancel,
  city
}
