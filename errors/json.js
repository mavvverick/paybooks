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
            debug: err.errors,
            type: err.name,
            notes: err.notes,
            apkUrl: err.apkUrl,
            apkSize: err.apkSize,
            psUpdate: err.psUpdate,
            psPackage: err.psPackage
          }
        }
      }
    }
    // if (!production) body.bettr.__debug__ = JSON.stringify(err.stack);
    res.json(body)
  }
}
