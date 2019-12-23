const sql = require('../db/sql')
const CError = require('../errors/cError')
const error = require('http-errors')
const sendSms = require('../lib/sms')
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
    return _sendOtp().then(data => {
      // TODO
      // if (data.type === 'success') {
      //   throw CError({
      //     status: 404,
      //     message: data.type,
      //     name: 'NotFound'
      //   })
      // }
      res.json(_resp('OK'))
    })
  }).catch(err => {
    next(error(err))
  })

  function _sendOtp () {
    const msg = 'Yolo Bus app login otp is ' + otp
    return sendSms(req.body.phone, msg)
  }
}

function token (req, res, next) {
  return sql.User.findOne({
    where: {
      phNumber: req.body.phone
    },
    attributes: ['userId', 'otp', 'isAgent', 'phNumber', 'updatedAt']
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

    user.otp = user.otp + '|true'
    user.save()
    const tokenExp = Math.floor(Date.now() / 1000) + (86400 * 60)
    const token = jwt.sign({
      exp: tokenExp, // 60 days expiry
      payload: {
        sub: user.userId,
        phNumber: user.phNumber,
        isAgent: user.isAgent
      }
    }, process.env.TOKEN_SECRET)

    res.json(_resp({
      token: token,
      expInSec: tokenExp,
      user: {
        sub: user.userId,
        phNumber: user.phNumber,
        isAgent: user.isAgent
      }
    }))
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
