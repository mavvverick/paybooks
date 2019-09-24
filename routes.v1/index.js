const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const busRoutes = require('./bus')
const supportRoutes = require('./support')
const userRoutes = require('./user')
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/oauth', authRoutes)
router.use('/bus', busRoutes)
router.use('/support', supportRoutes)
router.use('/user', userRoutes)

module.exports = router
