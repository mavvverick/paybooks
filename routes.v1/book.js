const express = require('express')
const router = express.Router()

const bookService = require('../services/booking')
const cancelService = require('../services/cancellations')
const busDetails = require('../middleware/getBus')
const deckData = require('../middleware/getDeckData')
const params = require('../serializers/bus')
const validate = require('express-validation')
const role = require('../middleware/role')

router.post('/init', role.isUser, validate(params.initBook), busDetails, deckData, bookService.initBooking)
router.post('/validate', role.isUser, bookService.commitBooking)
router.post('/cancel', role.isUser, validate(params.cancel), cancelService.cancel)
module.exports = router
