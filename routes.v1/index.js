const express = require('express')
const router = express.Router()
const walletRoutes = require('./wallet')
const codeRoutes = require('./code')
const taxRoutes = require('./tax')
const heimdall = require('../middleware/heimdall')
const access = require('../middleware/access')

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
)

let authMiddleware = null
if (process.env.NODE_ENV === 'production') {
  authMiddleware = heimdall.auth
} else {
  authMiddleware = heimdall.dummyUser
}

router.use('/wallets', access, walletRoutes)
router.use('/codes', authMiddleware, codeRoutes)
router.use('/taxes', authMiddleware, taxRoutes)
module.exports = router
