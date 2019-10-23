const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const busRoutes = require('./bus')
const bookRoutes = require('./book')
const supportRoutes = require('./support')
const userRoutes = require('./user')
const agentRoutes = require('./agent')
const heimdall = require('../middleware/heimdall')

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
)

let authMiddleware = null
if (process.env.NODE_ENV === 'dev') {
  authMiddleware = heimdall.dummyUser
} else {
  authMiddleware = heimdall.auth
}

router.use('/oauth', authRoutes)
router.use('/bus', busRoutes)
router.use('/book', authMiddleware, bookRoutes)
router.use('/support', authMiddleware, supportRoutes)
router.use('/user', authMiddleware, userRoutes)
router.use('/agent', authMiddleware, agentRoutes)
module.exports = router
