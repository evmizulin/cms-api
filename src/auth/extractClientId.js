const { ApiError } = require('../helpers/ApiError')
const { AccessToken } = require('../services/db/Db')
const { UNAUTHORIZED } = require('http-status-codes')

const extractClientId = async (req, res, next) => {
  const cookieAccessToken = req.cookies.accessToken
  const headerAccessToken = req.get('AccessToken')
  const accessToken = cookieAccessToken || headerAccessToken

  if (!accessToken) throw new ApiError(UNAUTHORIZED, 'AccessToken is not provided')
  const foundedAccessToken = await AccessToken.findOne({ token: accessToken })
  if (!foundedAccessToken) throw new ApiError(UNAUTHORIZED, 'AccessToken is not exist')

  req.extractedProps = { ...(req.extractedProps || {}), clientId: foundedAccessToken.clientId }

  next()
}

module.exports = { extractClientId }
