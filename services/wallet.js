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
      return res.status(201).json(resp(data))
    }).catch(err => {
      next(error(err))
    })
}

function transfer (req, res, next) {
  //TO and from, business code
  //TODO DEBIT CREDIT based on business logic
}

function creditNote (req, res, next) {
  return wallet.credit(req.body)
    .then(data => {
      return res.status(201).json(resp(data, 201))
    }).catch(err => {
      next(error(err))
  })
}

function debitNote (req, res, next) {
  return wallet.debit(req.body)
    .then(data => {
      return res.status(201).json(resp(data, 201))
    }).catch(err => {
      next(error(err))
    })
}


function initPayment (req, res, next) {
  return wallet.initPayment(req.body)
    .then(data => {
      return res.status(201).json(resp(data, 201))
    }).catch(err => {
      next(error(err))
    })
}

function validatePayment (req, res, next) {
  return wallet.validatePayment(req.body)
    .then(data => {
      return res.status(202).json(resp(data, 202))
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


function withdrawal (req, res, next) {

}

function transactions (req, res, next) {
  req.params.start = req.query.start || 5
  req.params.end = req.query.end || 0
  return wallet.transactions(req.params)
    .then(data => {
      return res.json(resp(data))
    }).catch(err => {
      next(error(err))
    })
}

function transactionsById (req, res, next) {
  return wallet.transactionsById(req.params)
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
  transfer,
  creditNote,
  debitNote,
  initPayment,
  validatePayment,
  refundPayment,
  withdrawal,
  transactions,
  transactionsById
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
