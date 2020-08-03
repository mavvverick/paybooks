const express = require('express')
const code = require('../services/code')
const router = express.Router()
const validate = require('express-validation')
const schema = require('../serializers/code')

router.get('/', code.findAll);
router.post('/', validate(schema.post), code.create);
router.get('/:id', code.findOne);
router.put('/:id', validate(schema.put), code.update);
router.delete('/:id', code.deleteOne);

module.exports = router