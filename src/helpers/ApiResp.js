const { getStatusText } = require('http-status-codes')
const { OK } = require('http-status-codes')

class ApiResp {
  constructor(body = null) {
    this.code = OK
    this.body = body || { message: getStatusText(OK) }
  }
}

module.exports = { ApiResp }
