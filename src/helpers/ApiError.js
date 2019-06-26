const { getStatusText } = require('http-status-codes')

class ApiError extends Error {
  constructor(code, message = null) {
    super(message || getStatusText(code))
    this.code = code
  }
}

module.exports = { ApiError }
