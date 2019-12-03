const Joi = require('joi')

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

const cancel = {
  body: {
    ticket_number: Joi.string().required(),
    seats: Joi.string().required()
  }
}

module.exports = {
  initBook,
  cancel
}
