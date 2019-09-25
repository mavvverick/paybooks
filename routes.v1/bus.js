const express = require('express')
const router = express.Router()
const searchService = require('../services/search')
const params = require('../serializers/bus')
const validate = require('express-validation')

router.post('/search', validate(params.search), searchService.search)
router.get('/seat', validate(params.seats), searchService.getSeatDetails)
module.exports = router
