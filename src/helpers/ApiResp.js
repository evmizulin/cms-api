const { getStatusText } = require('http-status-codes')

class ApiResp {
  constructor(code, message = null) {
    this.code = code
    this.body = { message: message || getStatusText(code) }
  }
}

module.exports = { ApiResp }
