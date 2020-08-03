const PaytmChecksum = require('../../paytm/checksum')
const request = require('request-promise')
const Schema = require('../schema')
require('../../../config/paytm')
const Paytm = require('paytm-pg-node-sdk')
const CError = require('../../../errors/cError')

function init (transactionRecord, data) {
  var channelId = Paytm.EChannelId.WAP
  var orderId = transactionRecord.id.toString()
  var txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, data.amount.toString())
  var userInfo = getUserInfo(transactionRecord.userId, data.phoneNumber)
  var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo)
  var paymentDetail = paymentDetailBuilder.build()
  return Paytm.Payment.createTxnToken(paymentDetail)
    .then(paytmResp => {
      if (paytmResp.jsonResponse === null) {
        throw new CError({
          status: 500,
          code: paytmResp.responseObject.body.resultInfo.resultCode,
          message: paytmResp.responseObject.body.resultInfo.resultMsg
        })
      }
      return paytmResp
    }).catch(function (err) {
      throw new Error(err)
    })
}

function validate (paymentData) {
  const checksum = paymentData.CHECKSUMHASH
  delete paymentData.userId
  delete paymentData.CHECKSUMHASH
  const validate = PaytmChecksum.verifySignature(
    paymentData,
    Paytm.MerchantProperties.merchantKey,
    checksum
  )

  if (!validate) {
    return null
  }

  if (paymentData.STATUS === 'TXN_SUCCESS') {
    return {
      currency: 'INR',
      transactionId: paymentData.ORDERID,
      orderId: paymentData.TXNID,
      meta: `${paymentData.GATEWAYNAME}|${paymentData.PAYMENTMODE}|${paymentData.BANKNAME}${paymentData.BANKTXNID}`,
      note: `${paymentData.RESPCODE}|${paymentData.STATUS}|${paymentData.RESPMSG}`,
      status: 'DONE'
    }
  }

  let txnStatus = 'FAILED'
  if (paymentData.STATUS === 'PENDING') {
    txnStatus = 'PENDING'
  }

  return {
    currency: 'INR',
    transactionId: paymentData.ORDERID,
    note: `${paymentData.RESPCODE}|${paymentData.STATUS}|${paymentData.RESPMSG}`,
    status: txnStatus
  }
}

function initRefund (tRecord, data){
  let amount = tRecord.amount
  if(data.amount < tRecord.amount){
    amount = data.amount
  }
  var orderId = tRecord.id.toString()
  var refId =  `r:${tRecord.id}`
  var txnId = tRecord.orderId
  var txnType = "REFUND"
  var refundAmount = amount.toString()
  var readTimeout = 80000
  var subWalletAmount = {}
  subWalletAmount[Paytm.UserSubWalletType.FOOD] = 0.00
  subWalletAmount[Paytm.UserSubWalletType.GIFT] = 0.00
  let extraParamsMap = {
    msg : data.message
  }
  var refund = new Paytm.RefundDetailBuilder(orderId, refId, txnId, txnType, refundAmount)
  var refundDetail = refund.setReadTimeout(readTimeout).setSubwalletAmount(subWalletAmount).setExtraParamsMap(extraParamsMap).build()
  return Paytm.Refund.initiateRefund(refundDetail)
    .then(resp => {
      rData = resp.responseObject.body
      if(rData.resultInfo.resultStatus === 'TXN_FAILURE'){
        throw new CError({
          message: rData.resultInfo.resultMsg,
          code: rData.resultInfo.resultCode,
          status: 406,
          name: 'Refund'
        })
      }  
      tRecord.refundAmount = amount
      tRecord.refund = `${rData.refundId}|${rData.resultInfo.resultStatus}|${rData.resultInfo.resultMsg}|${rData.resultInfo.resultCode}`
      tRecord.status = 'REVERT'
      tRecord.save()
      return tRecord
    }).catch(function (err) {
      throw new Error(err)
    }) 
}

module.exports = {
  init,
  validate,
  initRefund
}

function getUserInfo (userId, phoneNumber) {
  var userInfo = new Paytm.UserInfo(userId)
  userInfo.setAddress('10 MG Road')
  userInfo.setEmail('abc@gmail.com')
  userInfo.setFirstName('ABC')
  userInfo.setLastName('XX')
  userInfo.setMobile(phoneNumber)
  userInfo.setPincode('CUSTOMER_PINCODE')
  return userInfo
}
