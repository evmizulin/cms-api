const { getStatusText } = require('http-status-codes')

const getStatusMessage = (...props) => ({
  message: getStatusText(...props),
})

const getMessage = message => ({
  message,
})

module.exports = {
  getStatusMessage,
  getMessage,
  getStatusText,
}
