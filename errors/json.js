'use strict'
const statuses = require('statuses')
// const production = process.env.NODE_ENV || 'production'

module.exports = function apiErrorHandler () {
  return (err, req, res, next) => {
    if (process.env.NODE_ENV === 'dev') {
      console.log(err)
    }
    let status = err.status || err.statusCode || err.code || 500

    res.statusCode = status
    if (status < 400) status = 500
    let body = {}
    if (status > 500) {
      body = {
        Bettr: {
          status: statuses[status],
          data: {},
          error: {}
        }
      }
    } else {
      body = {
        yolo: {
          error: {
            code: err.code,
            message: err.message,
            type: err.name
          }
        }
      }
      if (process.env.NODE_ENV !== 'production') {
        body.yolo.error.debug = err.errors
      }
    }
    // if (!production) body.bettr.__debug__ = JSON.stringify(err.stack);
    res.json(body)
  }
}
