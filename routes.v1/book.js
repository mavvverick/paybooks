const express = require('express')
const router = express.Router()

const bookService = require('../services/booking')
const cancelService = require('../services/cancellations')
const busDetails = require('../middleware/getBus')
const deckData = require('../middleware/getDeckData')
const params = require('../serializers/bus')
const validate = require('express-validation')

router.post('/init', validate(params.initBook), busDetails, deckData, bookService.intiBooking)
router.post('/validate', bookService.commitBooking)
router.post('/cancel', validate(params.cancel), cancelService.cancel)
module.exports = router
