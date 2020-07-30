const express = require('express')
const wallet = require('../services/wallet')
const router = express.Router()
const extractUser = require('../middleware/user')

router.post('/hello', wallet.test)

router.post('/', wallet.create)
router.get('/:userId', wallet.get)
router.post('/:userId/credit', extractUser, wallet.credit)
router.post('/:userId/debit', extractUser, wallet.debit)
router.post('/:userId/note', extractUser, wallet.create)
router.post('/:userId/payments/init', extractUser, wallet.initPayment)
router.post('/:userId/payments/:transactionId/vaildate', extractUser, wallet.validatePayment)
router.post('/:userId/payments/:transactionId/refund', extractUser, wallet.refundPayment)

module.exports = router
