const express = require('express')
const router = express.Router()

const bookService = require('../services/booking')
const cancelService = require('../services/cancellations')
const getSchedule = require('../middleware/getSchedule')
const params = require('../serializers/bus')
const validate = require('express-validation')
const role = require('../middleware/role')
const cancelMiddleware = require('../middleware/validateCancel')

router.post('/init', role.isUser, validate(params.initBook), getSchedule, bookService.initBooking)
router.post('/validate', role.isUser, bookService.commitBooking)
router.post('/cancel', role.isUser, validate(params.cancel), cancelMiddleware, cancelService.cancel)
module.exports = router
