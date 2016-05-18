//Dependencies
var util = require('util');
var http = require('http');

//errors for send to user
function HttpError(status, message) {
    console.log('New http error ', status, message);
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
exports.HttpError = HttpError;