const Joi = require('joi')

const booking = {
  query: {
    filter: Joi.string().required()
  }
}

const bookDetail = {
  params: {
    bookId: Joi.string().required()
  }
}

const send = {
  body: {
    bookId: Joi.string().required()
  }
}

const rate = {
  body: {
    sId: Joi.string().required(),
    rating: Joi.number().required(),
    comment: Joi.string()
  }
}

const update = {
  body: {
    name: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string(),
    email: Joi.string()
  }
}

module.exports = {
  booking,
  bookDetail,
  send,
  rate,
  update
}
