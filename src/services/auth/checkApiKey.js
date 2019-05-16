const { ApiToken } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { UNAUTHORIZED } = require('http-status-codes')

const checkApiKey = async (req, res, next) => {
  const headerApiKey = req.get('ApiKey')
  if (!headerApiKey) throw new ApiError('Unvalid ApiKey', UNAUTHORIZED)
  const apiKey = await ApiToken.find({ token: headerApiKey }, 'projectId')
  if (!apiKey.length) throw new ApiError('Unvalid ApiKey', UNAUTHORIZED)

  req.projectId = apiKey[0].projectId

  next()
}

module.exports = { checkApiKey }
