const express = require('express')
const wallet = require('../services/wallet')
const router = express.Router()
const decode = require('../middleware/decode')


router.post('/', wallet.create)
router.get('/:userId', wallet.get)
router.get('/:userId/transactions', wallet.transactions)
router.get('/:userId/transactions/:transactionId', wallet.transactionsById)

router.post('/transfers', decode, wallet.transfer)
router.post('/notes/credit',decode, wallet.creditNote)
router.post('/notes/debit',decode,  wallet.debitNote)
router.post('/payments/init',decode, wallet.initPayment)
router.post('/payments/vaildate', wallet.validatePayment)
router.post('/payments/refund', wallet.refundPayment)

router.post('/hello', wallet.test)


module.exports = router
