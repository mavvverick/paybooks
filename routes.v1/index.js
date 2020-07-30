const express = require('express')
const router = express.Router()
const walletRoutes = require('./wallet')
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

router.use('/wallets', authMiddleware, walletRoutes)
module.exports = router
