const { AuthToken } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { UNAUTHORIZED } = require('http-status-codes')
const { getStatusText } = require('../../helpers/getStatusMessage')

const checkAuth = async (req, res, next) => {
  const cookieToken = req.cookies.authToken
  if (!cookieToken) throw new ApiError(getStatusText(UNAUTHORIZED), UNAUTHORIZED)
  const token = await AuthToken.find({ token: cookieToken })
  if (!token.length) throw new ApiError(getStatusText(UNAUTHORIZED), UNAUTHORIZED)
  req.userId = token[0].userId
  next()
}

module.exports = { checkAuth }
