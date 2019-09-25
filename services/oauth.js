const sql = require('../db/sql')
const CError = require('../errors/cError')
const error = require('http-errors')
const getOtp = require('../lib/otp')
const jwt = require('jsonwebtoken')
const generate = require('nanoid/generate')
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const _resp = require('../lib/resp')
function initOtp (req, res, next) {
  const otp = Math.floor(1000 + Math.random() * 9000)
  return sql.User.update(
    {
      otp: otp + '|' + (Date.now() + 300000)
    },
    {
      where: {
        phNumber: req.body.phone
      }
    }).then(row => {
    if (row < 1) {
      return sql.User.create({
        userId: generate(alphabet, 15),
        phNumber: req.body.phone,
        otp: otp + '|' + (Date.now() + 300000),
        model: req.data.deviceName,
        androidId: req.data.deviceId,
        imeiNumber: req.data.device
      }).then(user => {
        return _sendOtp()
      })
    }
    return _sendOtp()
  }).catch(err => {
    next(error(err))
  })

  function _sendOtp () {
    const msg = 'Yolo login otp is ' + otp
    return getOtp(req.body.phone, msg).then(data => {
      // TODO
      // res.json(_resp('OK'))
      res.json(_resp(otp.toString()))
    })
  }
}

function token (req, res, next) {
  return sql.User.findOne({
    where: {
      phNumber: req.body.phone
    },
    attributes: ['userId', 'otp', 'isAgent', 'updatedAt']
  }).then(user => {
    if (!user) {
      return next(error(new CError({
        status: 404,
        message: 'No user found.',
        name: 'NotFound'
      })))
    }

    const otp = parseOtpData(user.otp)

    if (otp.code !== req.body.otp) {
      return next(error(new CError({
        status: 404,
        message: 'Otp does not match.',
        name: 'NotFound'
      })))
    }

    if (isNaN(otp.expInMil) || Date.now() > otp.expInMil) {
      return next(error(new CError({
        status: 401,
        message: 'Max allowed time exceeded.',
        name: 'Unauthorized'
      })))
    }

    const tokenExp = Math.floor(Date.now() / 1000) + (86400 * 60)

    const token = jwt.sign({
      exp: tokenExp, // 60 days expiry
      payload: {
        sub: user.userId,
        phNumber: user.phNumber,
        isAgent: user.isAgent
      }
    }, process.env.TOKEN_SECRET)

    res.json(_resp({ token: token, expInSec: tokenExp }))
  })
}

module.exports = {
  initOtp,
  token
}

function parseOtpData (data) {
  const otpData = data.split('|')

  return {
    code: parseInt(otpData[0]),
    expInMil: parseInt(otpData[1])
  }
}
