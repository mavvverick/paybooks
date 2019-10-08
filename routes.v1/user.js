const express = require('express')
const userService = require('../services/user')
const params = require('../serializers/user')
const validate = require('express-validation')
const router = express.Router()

router.get('/me', userService.getProfile)
router.get('/bookings', validate(params.booking), userService.getMyBookings)
router.post('/send', validate(params.send), userService.sendTicket)
router.post('/rate', validate(params.rate), userService.rating)

module.exports = router
