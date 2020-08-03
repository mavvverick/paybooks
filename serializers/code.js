const Joi = require('joi')

const post = {
  body: {
    app: Joi.string().required(),
    provider: Joi.string(),
    meta: Joi.string().required(),
    to: Joi.string().required(),
    from: Joi.string().required(),
    userId: Joi.string().required(),
    fee: Joi.number().greater(-1).precision(2),
    cgst: Joi.number().greater(-1).precision(2),
    igst: Joi.number().greater(-1).precision(2)
  }
}

const put = {
  body: {
    meta: Joi.string(),
    to: Joi.string(),
    from: Joi.string(),
    userId: Joi.string().required(),
    version: Joi.number().required(),
    fee: Joi.number().greater(-1).precision(2),
    cgst: Joi.number().greater(-1).precision(2),
    igst: Joi.number().greater(-1).precision(2)
  }
}

module.exports = {
  post,
  put
}