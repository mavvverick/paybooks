const express = require('express')
const router = express.Router()
const searchService = require('../services/search')
const cityService = require('../services/cities')
const deckData = require('../middleware/getDeckData')
const routeChecker = require('../middleware/getRoutes')
const params = require('../serializers/bus')
const validate = require('express-validation')

router.post('/search', validate(params.search), routeChecker, searchService.search)
router.get('/seat', validate(params.seats), searchService.available)
router.get('/cities', cityService.cities)

module.exports = router
