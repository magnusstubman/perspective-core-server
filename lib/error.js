var util = require('util');

var AbstractError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error'
};
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'AbstractError';

var NotFoundError = function (msg) {
  NotFoundError.super_.call(this, msg, this.constructor);
};

util.inherits(NotFoundError, AbstractError);
NotFoundError.prototype.name = 'NotFoundError';

var ValidationError = function (msg) {
  ValidationError.super_.call(this, msg, this.constructor);
};

util.inherits(ValidationError, AbstractError);
ValidationError.prototype.name = 'ValidationError';

module.exports = {
	NotFoundError: NotFoundError,
	AbstractError: AbstractError,
	ValidationError: ValidationError
};