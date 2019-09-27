const error = require('http-errors')
const Support = require('../db/mongo/support')
const _resp = require('../lib/resp')

function submitRequest (req, res, next) {
  return Support.create({
    phNumber: req.user.phNumber,
    deviceName: req.body.deviceName,
    appVersion: req.body.version,
    category: req.body.category,
    description: req.body.description,
    state: 'ACTIVE'
  }).then(supp => {
    res.json(_resp('DONE'))
  }).catch(err => {
    next(error(err))
  })
}

module.exports = {
  submitRequest
}
