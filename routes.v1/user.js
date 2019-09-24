const express = require('express')
const userService = require('../services/user')

const router = express.Router()

router.get('/', userService.getProfile)
router.get('/bookings', userService.getMyBookings)
router.post('/ticket/send', userService.sendTicket)

module.exports = router
