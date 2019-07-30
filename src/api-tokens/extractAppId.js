const { ApiError } = require('../helpers/ApiError')
const { App } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../helpers/isIdValid')

const extractAppId = async (req, res, next) => {
  const { appId } = req.params

  if (!isIdValid(appId)) throw new ApiError(NOT_FOUND, 'ApiTokenId is not valid')
  const foundedApp = await App.findById(appId, { _id: true })
  if (!foundedApp) throw new ApiError(NOT_FOUND, 'ApiToken not found')

  req.extractedProps = { ...(req.extractedProps || {}), appId: foundedApp.id }

  next()
}

module.exports = { extractAppId }
