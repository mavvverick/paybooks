`use strict`

// function UnauthorizedError(code, error){
//     this.name = "UnauthorizedError";
//     this.message = error.message;
//     Error.call(this, error.message);
//     Error.captureStackTrace(this, this.constructor);
//     this.code = code;
//     this.status = 401;
//     this.inner = this.error;

// }

function UnauthorizedError (message) {
  this.name = 'UnauthorizedError'
  this.message = message
  Error.call(this, message)
  Error.captureStackTrace(this, this.constructor)
  this.status = 401
  this.inner = this.message
}

UnauthorizedError.prototype = Object.create(Error.prototype)
UnauthorizedError.prototype.constructor = UnauthorizedError

module.exports = UnauthorizedError
