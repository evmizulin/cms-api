const { ApiError } = require('../helpers/ApiError')
const { Model } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../helpers/isIdValid')

const extractModelId = async (req, res, next) => {
  const { modelId } = req.params

  if (!isIdValid(modelId)) throw new ApiError(NOT_FOUND, 'ModelId is not valid')
  const foundedModel = await Model.findById(modelId, { _id: true })
  if (!foundedModel) throw new ApiError(NOT_FOUND, 'Model not found')

  req.extractedProps = { ...(req.extractedProps || {}), modelId: foundedModel.id }

  next()
}

module.exports = { extractModelId }
