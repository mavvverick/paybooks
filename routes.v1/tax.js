const express = require('express')
const tax = require('../services/tax')
const router = express.Router()
const validate = require('express-validation')
const schema = require('../serializers/tax')

router.get('/', tax.findAll);
router.post('/', validate(schema.post), tax.create);
router.put('/:id', validate(schema.put), tax.update);
// router.get('/:id', tax.findOne);
// router.delete('/:id', tax.deleteOne);

module.exports = router