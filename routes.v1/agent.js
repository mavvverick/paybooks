const express = require('express')
const router = express.Router()
const agentService = require('../services/agent')
const params = require('../serializers/agent')
const validate = require('express-validation')
const busDetails = require('../middleware/getBus')
const deckData = require('../middleware/getDeckData')
const role = require('../middleware/role')

router.post('/init-wallet', role.isAgent, agentService.initWallet)
router.post('/validate', role.isAgent, agentService.commit)
router.post('/book', role.isAgent, validate(params.initBook), busDetails, deckData, agentService.initBooking)
router.get('/balance', role.isAgent, agentService.getWalletBalance)

module.exports = router
