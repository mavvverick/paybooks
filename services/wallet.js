const Wallet = require('../lib/batua/index')
const sql = require('../db/sql')
const error = require('http-errors')
const resp = require('../lib/resp')

const wallet = new Wallet({
  Sequelize: sql.sequelize,
  TransactionModel: sql.Transaction,
  WalletModel: sql.Wallet,
  Currency: 'INR'
})

function get (req, res, next) {
  return wallet.balance(req.params)
    .then(data => {
      return res.json(resp(data))
    }).catch(err => {
      next(error(err))
    })
}

function create (req, res, next) {
  return wallet.create(req.body)
    .then(data => {
      return res.json(resp(data))
    }).catch(err => {
      next(error(err))
    })
}

function credit (req, res, next) {
  return wallet.credit(req.body)
    .then(data => {
      return res.json(resp(data, 201))
    }).catch(err => {
      next(error(err))
    })
}

function debit (req, res, next) {
  return wallet.debit(req.body)
    .then(data => {
      return res.json(resp(data, 201))
    }).catch(err => {
      next(error(err))
    })
}


function initPayment (req, res, next) {
  return wallet.initPayment(req.body)
    .then(data => {
      return res.json(resp(data, 201))
    }).catch(err => {
      next(error(err))
    })
}

function validatePayment (req, res, next) {
  return wallet.validatePayment(req.body)
    .then(data => {
      return res.json(resp(data, 202))
    }).catch(err => {
      next(error(err))
    })
}

function refundPayment (req, res, next) {
  return wallet.refund(req.body)
    .then(data => {
      return res.json(resp(data, 202))
    }).catch(err => {
      next(error(err))
    })
}


function transferToWallet (req, res, next) {

}

function transferToAccount (req, res, next) {

}

function getTransactions (req, res, next) {
  return wallet.transactions(req.body)
    .then(data => {
      return res.json(resp(data))
    }).catch(err => {
      next(error(err))
    })
}


function test (req, res, next) {
  return res.json('OK')
}

module.exports = {
  test,
  get,
  create,
  credit,
  debit,
  initPayment,
  validatePayment,
  refundPayment
  transferToWallet,
  transferToAccount,
  getTransactions
}

// const Wallet = require("../../batua/lib")

// inwards PG -> Wallet
//             or pay futher to next wallet -> wallet
// Payouts (outwards wallet -> bank)
// Credits | Credit note | debit note | Reimbursement | other services (internal wallet to wallet)
// commision, settle from commision account to wallet
// Penny testing (during kyc send arbitary amount to given bank account IMPS)
// Cash Collection: Take inwards cash -> Walslet as negative entry and update on cash is collected
// (discuss in detail as desosit will be in bulk but how to settle transactions)

// PG - paytm, razorpay
// Payout - using IDFC api, Refunds, Beneficiary Validation
// Ledger
// Double entry Book keeping / Accounting system
// Virtual account integration
// Webhook server for VA Notification (Insta Alert) API
// Invoicing and templates
// Notification service
// offline entry input mechanism (incl. Collection Enquiry API)
// IDFC UPI integration
