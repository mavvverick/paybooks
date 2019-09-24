const express = require('express')
const supportService = require('../services/support')

const router = express.Router()

router.post('/', supportService.submitRequest)
// router.get('/', supportCtrl.getSupportRequests)

module.exports = router
