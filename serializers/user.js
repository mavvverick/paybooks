const Joi = require('joi')

const rate = {
  body: {
    sId: Joi.string().required(),
    rating: Joi.number().required(),
    comment: Joi.string()
  }
}



module.exports = {
  rate
}
