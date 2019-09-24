function CustomError (err) {
  this.name = err.name || 'Error'
  this.message = err.message
  this.code = err.code
  Error.call(this, err.message)
  Error.captureStackTrace(this, this.constructor)
  this.status = err.status
  //  this.inner = this.message
}

CustomError.prototype = Object.create(Error.prototype)
CustomError.prototype.constructor = CustomError

module.exports = CustomError
