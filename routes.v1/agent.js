const express = require('express')
const router = express.Router()
const agentService = require('../services/agent')
const params = require('../serializers/agent')
const validate = require('express-validation')
const getSchedule = require('../middleware/getSchedule')
const role = require('../middleware/role')
const cancelMiddleware = require('../middleware/validateCancel')

router.post('/init-wallet', role.isAgent, agentService.initWallet)
router.post('/validate', role.isAgent, agentService.commit)
router.post('/book', role.isAgent, validate(params.initBook), getSchedule, agentService.initBooking)
router.get('/balance', role.isAgent, agentService.getWalletBalance)
router.post('/cancel', role.isAgent, validate(params.cancel), cancelMiddleware, agentService.cancel)

module.exports = router
