const express = require('express')
const router = express.Router()
const authService = require('../services/oauth')
const params = require('../serializers/auth')
const validate = require('express-validation')

router.get('/', (req, res) => {
  res.send('Hello! The API is at http://localhost:' + process.env.PORT + '/api')
})

router.post('/init', validate(params.init), authService.initOtp)
router.post('/token', validate(params.token), authService.token)
module.exports = router
