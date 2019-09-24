const error = require('http-errors')
const Support = require('../db/mongo/support')

function submitRequest (req, res, next) {
  return Support.create({
    phNumber: req.user.phNumber,
    deviceName: req.body.deviceName,
    appVersion: req.body.version,
    category: req.body.category,
    description: req.body.description,
    state: 'ACTIVE'
  }).then(supp => {
    res.json(('DONE'))
  }).catch(err => {
    next(error(err))
  })
}

module.exports = {
  submitRequest
}
