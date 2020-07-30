'use strict'
const jobs = require('./jobs')
const Schema = require('./schema')
const providers = require('./providers/index')

const Wallet = function (params) {
  if (params === undefined) {
    throw Error(
      "[Error] parameters missing, wallet can 't be initiated without params"
    )
  }
  this.Sequelize = params.Sequelize
  this.TransactionModel = params.TransactionModel
  this.WalletModel = params.WalletModel
  // console.log('----- init Wallet -----');
}

Wallet.prototype.debit = function (data) {
  if (data === undefined) {
    throw new Error(
      'Set transaction category before calling debit'
    )
  }
  const self = this
  data.provider = 'SELF'
  data.currency = 'INR'
  data.type = 'DR'
  data.status = 'DONE'
  return jobs.debitTransfer.call(self, data)
}

Wallet.prototype.withdraw = function (data) {
  if (data === undefined) {
    throw new Error(
      'Set transaction category before calling credit'
    )
  }

  const self = this
  data.currency = 'INR'
  data.type = 'DR'
  data.status = 'INIT'
  return jobs.debitTransfer.call(self, data)
}

Wallet.prototype.credit = function (data) {
  if (data === undefined) {
    throw new Error(
      'Set transaction category before calling credit'
    )
  }

  const self = this
  data.provider = 'SELF'
  data.currency = 'INR'
  data.type = 'CR'
  data.status = 'DONE'
  return jobs.creditTransfer.call(self, data)
}

Wallet.prototype.balance = function (data) {
  const self = this
  return jobs.getBalance.call(self, data)
}

Wallet.prototype.initPayment = function (data) {
  const self = this
  data.category = 'BUY'
  data.type = 'CR'
  if (!data.hasOwnProperty('gateway')) {
    throw new Error('No gateway Provided')
  }

  if (data.gateway === 'PAYTM') {
    return jobs.initPayment.call(self, data, null)
      .then(transactionsRecord => {
        return providers.paytm.init(transactionsRecord, data)
          .then(paytmResp => {
            transactionsRecord.meta = paytmResp.jsonResponse
            return transactionsRecord
          })
      }).catch(function (err) {
        throw new Error(err)
      })
  }
  return providers.rzp.init(data)
    .then(rzpRecord => {
      return jobs.initPayment.call(self, data, rzpRecord)
    }).catch(function (err) {
      throw new Error(err)
    })
}

Wallet.prototype.validatePayment = function (paymentData) {
  const self = this
  let validateData = null
  if (paymentData.hasOwnProperty('CHECKSUMHASH')) {
    const paymentObj = Schema.validatePaytmData(paymentData)
    validateData = providers.paytm.validate(paymentObj)
  } else if (paymentData.hasOwnProperty('razorpay_signature')) {
    const paymentObj = Schema.validateRzpData(paymentData)
    validateData = providers.rzp.validate(paymentObj)
  }

  if (validateData) {
    return jobs.commitPayment.call(self, validateData)
  } else {
    throw new Error('Signature Validate Error')
  }
}

Wallet.prototype.refund = function (data) {
  const self = this
  const refundObj = Schema.refundPayment(data)
  return jobs.getTransactionById.call(self, refundObj)
  .then(tRecord => {
    if(tRecord.status !== 'DONE'){
      throw new Error('Can not raise refund, contact support')
    }
    if(tRecord.provider === 'PAYTM'){
      return providers.paytm.initRefund(tRecord, refundObj)
    }else if(tRecord.provider === 'RZP'){
      return providers.rzp.initRefund(tRecord, refundObj)
    }
  })
}



Wallet.prototype.transactions = function (data) {
  const self = this
  return jobs.getTransactions.call(self, data)
}

Wallet.prototype.create = function (data) {
  const self = this
  return jobs.createWallet.call(self, data)
}

module.exports = Wallet
