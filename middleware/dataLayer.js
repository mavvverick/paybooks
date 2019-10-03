const error = require('http-errors')
const CError = require('../errors/cError')

const data = (req, res, next) => {
  req.data = {}
  req.data.platform = req.headers['x-yolo-platform']
  req.data.device = req.headers['x-yolo-device']
  req.data.deviceName = req.headers['x-yolo-device-name']
  req.data.deviceId = req.headers['x-yolo-device-id']
  req.data.package = req.headers['x-yolo-package-id']
  req.data.version = req.headers['x-yolo-apk-version']
  next()
}

module.exports = data
