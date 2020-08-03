const Joi = require('joi')

const post = {
    body: {
      state: Joi.string().required(),
      codeId: Joi.number(),
      sgst: Joi.number().greater(-1).precision(2),
      version: Joi.number()
    }
}

const put = {
  body: {
    sgst: Joi.number().greater(-1).precision(2),
    version: Joi.number().required()
  }
}


  
  module.exports = {
    post,
    put
  }